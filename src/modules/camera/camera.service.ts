import { Injectable } from '@nestjs/common';
import { CreateCameraDto } from './dto/create-camera.dto';
import { UpdateCameraDto } from './dto/update-camera.dto';
import { InjectModel ,InjectConnection } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { CURD } from 'src/shared/utils/curd.util';
import { CreateCounterDto } from '../counter/dto/create-counter.dto';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';

@Injectable()
export class CameraService {
  constructor(
    @InjectModel('Camera') private readonly cameraSchema: Model<CreateCameraDto>,
    @InjectModel('Counter') private readonly counterSchema: Model<CreateCounterDto>,
    @InjectConnection() private readonly connection: mongoose.Connection
  ){}


  // 这里创建一个摄像头根据conter表来给摄像头一个自增编号，以方便搜寻，默认1000
  async create(dto: CreateCameraDto) {
    let result;
    let session = await this.connection.startSession(); 
    session.startTransaction();
    try {
      let no = null;
      let counter = await this.counterSchema.findOne({ sequence_id :'camera_id' }).session(session);
      if(counter){
        let u_cr = await this.counterSchema.findOneAndUpdate({ sequence_id :'camera_id' },{ $inc:{sequence_value:1 }},{new:true }).session(session);
        no = u_cr.sequence_value
      } else {
        // 默认编号从1001开始
        let defaultNo = 1001
        let counter_schema = new this.counterSchema({
          sequence_id : 'camera_id',
          sequence_value  :defaultNo
        })
        await counter_schema.save({session})
        no = defaultNo;
      }
      const tag = new this.cameraSchema({
        name : dto.name,
        iccid:dto.iccid,
        no,
        url:dto.url
      })
      result = await tag.save({session})
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BaseException(ResultCode.ERROR,{},error)
    }finally{
      await session.endSession();
    }
    return result
  }

  async updateInfo(dto: UpdateCameraDto) {
    return await this.cameraSchema.findByIdAndUpdate(dto.id,{
      name :dto.name,
      iccid:dto.iccid,
      url:dto.url
    })
  }

  async findById(id :string) {
    return this.cameraSchema.findById(id)
  }

  async remove(id :string) {
    return await this.cameraSchema.findByIdAndRemove(id)
  }

  // 获取所有摄像头带分页，通常管理员有这个权限
  async findAll(page :number ,limit :number ,options ? :object) {
    const curd = new CURD(this.cameraSchema)
    return curd.pagination(page,limit,options || {});
  }

  // 根据公司ID获取公司可以操作的摄像头列表
  async findByCompanyId(company_id :string){
    return await this.cameraSchema.find({ company_id :new Types.ObjectId(company_id) })
  }

  // 管理员分配摄像头
  async assignCompany(id :string ,company_id:string){
    return await this.cameraSchema.findByIdAndUpdate(id ,{ company_id : new Types.ObjectId(company_id) ,state: 2 })
  }

  // 管理员撤销分配摄像头
  async unAssignCompany(id :string ){
    return await this.cameraSchema.findByIdAndUpdate(id ,{ company_id : null ,state: 0 })
  }
}
