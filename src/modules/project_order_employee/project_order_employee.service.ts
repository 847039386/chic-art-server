import { Injectable } from '@nestjs/common';
import { CreateProjectOrderEmployeeDto } from './dto/create-project_order_employee.dto';
import { UpdateProjectOrderEmployeeDto } from './dto/update-project_order_employee.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { CURD } from 'src/shared/utils/curd.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';

@Injectable()
export class ProjectOrderEmployeeService {

  constructor(
    @InjectModel('ProjectOrderEmployee') private readonly projectOrderEmployeeSchema: Model<any>,
    @InjectModel('CompanyEmployee') private readonly companyEmployeeSchema: Model<any>,
    @InjectModel('ProjectOrder') private readonly projectOrderSchema: Model<any>,
    @InjectModel('Company') private readonly companySchema: Model<any>,
    @InjectConnection() private readonly connection: mongoose.Connection
  ){}

  async findByProjectOrderId(project_order_id :string) {
    return await this.projectOrderEmployeeSchema.find({ project_order_id :new Types.ObjectId(project_order_id)}).populate('company_employee_id user_id')
  }

  async findOne(dto :any){
    return await this.projectOrderEmployeeSchema.findOne(dto)
  }
  
  async findAll(user_id :string ,page :number ,limit :number ,state? :number) {

    page = Number(page);
    limit = Number(limit);
    user_id = user_id;
    state = Number(state)

    let aggregates :any = [
      {
        $match : { user_id :new Types.ObjectId(user_id) }
      },
      { 
        $sort: { "create_time": -1 } 
      },
      {
        $lookup: {
          from: "project_order",
          localField: "project_order_id",
          foreignField: "_id",
          as: "project_order_id"
        }
      },
      {
        $unwind: "$project_order_id"
      },
    ]
    if(!isNaN(state)){
      aggregates.push({
        $match : { 'project_order_id.state' : state }
      })
    }

    aggregates = aggregates.concat([
      {
        $lookup: {
          from: "user",
          localField: "project_order_id.user_id",
          foreignField: "_id",
          as: "project_order_id.user_id"
        }
      },
      {
        $unwind: "$project_order_id.user_id"
      },
      {
        $lookup: {
          from: "company",
          localField: "project_order_id.company_id",
          foreignField: "_id",
          as: "project_order_id.company_id"
        }
      },
      {
        $unwind: "$project_order_id.company_id"
      },
      {
        $facet :{
          total: [{ $count:"count" }],
          rows:[
            { $skip:(page - 1) * limit },
            { $limit: limit} ,
          ]
        }
      },
      {
        $project: {
            data:'$rows',
            total: {$arrayElemAt: [ "$total.count", 0 ]},
            
        }
      },
    ])


    let result :any = await this.projectOrderEmployeeSchema.aggregate(aggregates)
    let rows = result[0].data
    let total = result[0].total || 0;
    return {
      currentPage :page,
      pageSize :limit,
      totalPage: total ? Math.ceil(total / limit) : 1,
      total :total,
      rows :rows
    };
  }

  async create(dto :CreateProjectOrderEmployeeDto ) {
    let session = await this.connection.startSession(); 
    session.startTransaction();
    let result;
    try {
      let user_id = new Types.ObjectId(dto.user_id)
      let project_order_id = new Types.ObjectId(dto.project_order_id)
      let company_employee_id = new Types.ObjectId(dto.company_employee_id)
      let po_info = await this.projectOrderSchema.findById(dto.project_order_id).session(session)
      if(!po_info){
        // 订单不存在
        throw new BaseException(ResultCode.PROJECT_ORDER_IS_NOT,{})
      }
      let poe_info = await this.projectOrderEmployeeSchema.findOne({ user_id , project_order_id })
      if(poe_info){
        // 存在该员工
        throw new BaseException(ResultCode.PROJECT_ORDER_EMPLOYEE_IS_EXIST,{})
      }
      const projectOrder = new this.projectOrderEmployeeSchema({ user_id , project_order_id ,company_employee_id})
      result =  await projectOrder.save({ session })
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BaseException(ResultCode.ERROR,{},error)
    }finally{
      await session.endSession();
    }
    return result;

  }

  async remove(id :string) {
    let session = await this.connection.startSession(); 
    session.startTransaction();
    let result;
    try {

      const poe_info = await this.projectOrderEmployeeSchema.findById(id).session(session);
      
      if(!poe_info){
        throw new BaseException(ResultCode.PROJECT_ORDER_EMPLOYEE_IS_NOT,{})
      }

      if(!poe_info.company_employee_id)
      {
        // 该项目逻辑，该表company_employee_id为空的时候，一定是订单负责人所以不允许继续操作
        throw new BaseException(ResultCode.PROJECT_ORDER_EMPLOYEE_BAN_DEL,{})
      }
      result =  await this.projectOrderEmployeeSchema.findByIdAndRemove(id).session(session)
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
