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

  async findById(id: string) {
    return await this.companyCameraSchema.findById(id).populate('camera_id');
  }

  async findByIdAndPOrder(id: string) {
    let result = await this.companyCameraSchema.aggregate([
      {
        $match: { _id :new Types.ObjectId(id) }
      },
      {
        $lookup:{
          from:'camera',  
          localField:'camera_id', 
          foreignField:'_id',  
          as:'camera_id',  
        },
      },
      {
        $unwind: '$camera_id'
      },
      {
        $lookup:{
          from:'project_order_camera',  
          localField:'_id',  
          foreignField:'company_camera_id', 
          as:'project_order_camera_id',  
        },
      },
      {
        $unwind: {
          path:"$project_order_camera_id",
          preserveNullAndEmptyArrays:true,
        } 
      },
      {
        $lookup:{
          from:'project_order',  
          localField:'project_order_camera_id.project_order_id', 
          foreignField:'_id',  
          as:'project_order_id',  
        },
      },
      {
        $unwind: {
          path:"$project_order_id",
          preserveNullAndEmptyArrays:true,
        } 
      },
    ])
    return result[0]
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
      // 修改摄像头状态为1，就是该摄像头已分配给公司了
      await this.cameraSchema.findByIdAndUpdate(dto.camera_id,{
        state : 1
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

  async findByIdAndUpdate(id :string, update:object){
    return await this.companyCameraSchema.findByIdAndUpdate(id,update)
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
        // 修改摄像头状态为闲置，证明没有公司使用他即未分配状态
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
