import { Injectable } from '@nestjs/common';
import { CreateCompanyCameraDto ,AssignCameraToCompanyDto } from './dto/create-company_camera.dto';
import { UpdateCompanyCameraDto } from './dto/update-company_camera.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { CURD } from 'src/shared/utils/curd.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';

@Injectable()
export class CompanyCameraService {

  constructor(
    @InjectModel('CompanyCamera') private readonly companyCameraSchema: Model<any>,
    @InjectModel('Camera') private readonly cameraSchema: Model<any>,
    @InjectConnection() private readonly connection: mongoose.Connection
  ){}

  

  async findAll(page :number ,limit :number ,options ? :object) {
    const curd = new CURD(this.companyCameraSchema)
    return curd.pagination(page,limit,options || {});
  }

  findOne(id: number) {
    return `This action returns a #${id} companyCamera`;
  }

  async isExist(dto :AssignCameraToCompanyDto){
    let result = await this.companyCameraSchema.findOne({
      camera_id : new Types.ObjectId(dto.camera_id),
      company_id : new Types.ObjectId(dto.company_id)
    })
    return result ? true : false;
  }

  async create(dto :AssignCameraToCompanyDto){
    let session = await this.connection.startSession(); 
    session.startTransaction();
    let result;
    try {
      // 修改摄像头状态为2，就是已有公司使用并且是空闲状态
      await this.cameraSchema.findByIdAndUpdate(dto.camera_id,{
        state : 2
      }).session(session)
      // 创建摄像头与公司关系
      const companyCamera = new this.companyCameraSchema({
        camera_id : new Types.ObjectId(dto.camera_id),
        company_id : new Types.ObjectId(dto.company_id)
      })
      result = await companyCamera.save({ session })
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BaseException(ResultCode.ERROR,{},error)
    }finally{
      await session.endSession();
    }
    return result;
  }

  async remove(id: string) {
    let session = await this.connection.startSession(); 
    session.startTransaction();
    let result;
    try {
      // 根据传来的关系ID获取摄像头ID
      let cc =  await this.companyCameraSchema.findById(id).session(session)
      let camera_id = cc.camera_id;
      if(camera_id){
        // 修改摄像头状态为闲置，证明没有公司使用他
        await this.cameraSchema.findByIdAndUpdate(camera_id,{
          state : 0
        }).session(session)
        // 删除掉摄像头与公司的关系
        result = await this.companyCameraSchema.findByIdAndRemove(id).session(session);
      }else{
        result = cc;
      }
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BaseException(ResultCode.ERROR,{},error)
    }finally{
      await session.endSession();
    }
    return result;

  }

}
