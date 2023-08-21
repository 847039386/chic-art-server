import { Injectable } from '@nestjs/common';
import { CreateProjectOrderCameraDto } from './dto/create-project_order_camera.dto';
import { UpdateProjectOrderCameraDto } from './dto/update-project_order_camera.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';

@Injectable()
export class ProjectOrderCameraService {

  constructor(
    @InjectModel('ProjectOrderCamera') private readonly projectOrderCameraSchema: Model<any>,
    @InjectModel('CompanyCamera') private readonly companyCameraSchema: Model<any>,
    @InjectConnection() private readonly connection: mongoose.Connection
  ){}

  async create(dto: CreateProjectOrderCameraDto) {
    // const projectOrderCamera = new this.projectOrderCameraSchema({
    //   company_camera_id: new Types.ObjectId(dto.company_camera_id),
    //   project_order_id: new Types.ObjectId(dto.project_order_id)
    // })
    // return await projectOrderCamera.save()

    let session = await this.connection.startSession(); 
    session.startTransaction();
    let result;
    try {
      let cc_info = await this.companyCameraSchema.findById(dto.company_camera_id).session(session);
      console.log(cc_info)
      if(cc_info){
        const today = new Date(Date.now());
        const expire_time = cc_info.expire_time;
        if(expire_time < today){
          // 公司摄像头已过期
          throw new BaseException(ResultCode.COMPANY_CAMERA_EXPIRE,{})
        }
        if(cc_info.state == 1){
          throw new BaseException(ResultCode.COMPANY_CAMERA_IS_WORK,{})
        }
      }
      // 修改公司摄像头为工作中，因为他已进入了订单
      await this.companyCameraSchema.findByIdAndUpdate(dto.company_camera_id,{ state : 1}).session(session)
      // 创建订单与公司摄像头的关系
      const projectOrderCamera = new this.projectOrderCameraSchema({
        company_camera_id: new Types.ObjectId(dto.company_camera_id),
        project_order_id: new Types.ObjectId(dto.project_order_id)
      })
      result =  await projectOrderCamera.save({session})
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BaseException(ResultCode.ERROR,{},error)
    }finally{
      await session.endSession();
    }
    return result;



  }

  async findByProjectOrderId(project_order_id :string) {
    // 这个获取所有，包括过期的看看吧到时候，没准在前端做判定
    // return await this.projectOrderCameraSchema.find({ project_order_id :new Types.ObjectId(project_order_id) }).populate({
    //   path:'company_camera_id',
    //   // match:{ expire_time :{ "$gte": Date.now() } },
    //   populate : {
    //     path:'camera_id',
    //   }
    // });
    const today = new Date(Date.now())
    return await this.projectOrderCameraSchema.aggregate([
      {
        $match: { project_order_id :new Types.ObjectId(project_order_id) }
      },
      {
        $lookup:{
          from:'company_camera',  // 关联的集合
          localField:'company_camera_id',  // 本地关联的字段
          foreignField:'_id',  // 对方集合关联的字段
          as:'company_camera_id',  // 结果字段名,
        },
      },
      {
        $unwind: '$company_camera_id'
      },
      {
        // 摄像头过期的则不显示
        $match: { 'company_camera_id.expire_time' :{ "$gt": today } }
      },
      {
        $lookup:{
          from:'camera',  // 关联的集合
          localField:'company_camera_id.camera_id',  // 本地关联的字段
          foreignField:'_id',  // 对方集合关联的字段
          as:'company_camera_id.camera_id',  // 结果字段名,
        },
      },
      {
        $unwind: '$company_camera_id.camera_id'
      }
    ])

  }

  async remove(id: string) {
    return await this.projectOrderCameraSchema.findByIdAndRemove(id);
  }

  async findOne(query){
    return await this.projectOrderCameraSchema.findOne(query);
  }
}
