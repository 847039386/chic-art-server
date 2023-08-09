import { Injectable } from '@nestjs/common';
import { CreateProjectOrderUserDto ,CreateProjectOrderClientDto } from './dto/create-project_order_user.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { CreateSystemMessageDto } from '../message/dto/create-message.dto';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { CreateCompanyEmployeeDto } from '../company_employee/dto/create-company_employee.dto';
import { ProjectOrder } from '../project_order/schema/project_order.schema';
import { IMessage } from '../message/interface/message.interface';


@Injectable()
export class ProjectOrderUserService {
  constructor(
    @InjectModel('ProjectOrderUser') private readonly projectOrderUserSchema: Model<any>,
    @InjectModel('ProjectOrder') private readonly projectOrderSchema: Model<any>,
    @InjectModel('CompanyEmployee') private readonly companyEmployeeSchema: Model<any>,
    @InjectModel('Message') private readonly messageSchema: Model<any>,
    @InjectConnection() private readonly connection: mongoose.Connection
  ){}

  // 添加员工
  async create(dto: CreateProjectOrderUserDto) {
    let newSchema = []
    dto.user_ids.forEach((element) => {
      newSchema.push({ 
        identity_type:0,
        state:1,
        project_order_id :dto.project_order_id ,
        user_id :element })
    })
    return await this.projectOrderUserSchema.insertMany(newSchema)
  }

  // 添加用户，一般都是用户扫码添加过来所以
  async addClient(dto :CreateProjectOrderClientDto){
    // 添加员工时候状态为0需要审核，拒绝后直接删除
    let session = await this.connection.startSession(); 
    session.startTransaction();
    let result;
    try {
      // 获取该订单的所属公司
      const projectOrder = await this.projectOrderSchema.findById(dto.project_order_id).populate('company_id').session(session)
      if(!projectOrder && !projectOrder.company_id){
        throw new BaseException(ResultCode.ERROR,{})
      }
      const company_id :string = projectOrder.company_id._id
      const company_user_id :string = projectOrder.company_id.user_id
      // 查找公司中所有的管理
      let c_admins = await this.companyEmployeeSchema.find({ company_id ,identity_type :1}).session(session)

      // 添加了一个员工
      const projectOrderUser = new this.projectOrderUserSchema({
        user_id: new Types.ObjectId(dto.user_id),
        project_order_id: new Types.ObjectId(dto.project_order_id),
        identity_type: 1, 
        state:0 
      })
      result = await projectOrderUser.populate('user_id').save({ session })
      const name = result.user_id.name || result.user_id.nickname;  //使用真实姓名或者昵称
      // 先给公司创始人发条信息，然后给所有公司管理层发条信息
      let csr_message :IMessage = { 
        type:0,
        title:'系统消息',
        content:`${name} 客户申请加入工单`,
        recv_user_id :company_user_id
      }
      let c_admins_message :IMessage [] =[ csr_message ]
      if(c_admins.length > 0){
        c_admins.forEach((element) =>{
          c_admins_message.push({
            type:0,
            title:'系统消息',
            content:`${name} 客户申请加入工单`,
            recv_user_id :company_user_id
          })
        })
      }
      let addCompanyAdminMessages = await this.projectOrderUserSchema.insertMany(c_admins_message,{session})
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BaseException(ResultCode.ERROR,{},error)
    }finally{
      await session.endSession();
    }
    return result;

  }

  async findAllByProjectOrderId(project_order_id :string) {
    return await this.projectOrderUserSchema.find({project_order_id});
  }

  async remove(id: string) {
    return await this.projectOrderUserSchema.findByIdAndRemove(id)
  }

}
