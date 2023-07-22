import { Injectable } from '@nestjs/common';
import { CreateCameraDto } from './dto/create-camera.dto';
import { UpdateCameraDto } from './dto/update-camera.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CURD } from 'src/shared/utils/curd.util';

@Injectable()
export class CameraService {
  constructor(
    @InjectModel('Camera') private readonly cameraSchema: Model<CreateCameraDto>,
    ){}


  async create(dto: CreateCameraDto) {
    const tag = new this.cameraSchema({
      name : dto.name,
      iccid:dto.iccid,
      url:dto.url
    })
    return await tag.save()
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
