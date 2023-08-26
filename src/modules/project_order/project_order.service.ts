import { Injectable } from '@nestjs/common';
import { CreateProjectOrderDto } from './dto/create-project_order.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ProjectOrderHandOverDto } from './dto/update-project_order.dto';
import mongoose, { Model, Types } from 'mongoose';
import { CURD } from 'src/shared/utils/curd.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';

@Injectable()
export class ProjectOrderService {

  constructor(
    @InjectModel('Company') private readonly companySchema: Model<any>,
    @InjectModel('ProjectOrder') private readonly projectOrderSchema: Model<any>,
    @InjectModel('CompanyCamera') private readonly companyCameraSchema: Model<any>,
    @InjectModel('CompanyEmployee') private readonly companyEmployeeSchema: Model<any>,
    @InjectModel('ProjectOrderNote') private readonly projectOrderNoteSchema: Model<any>,
    @InjectModel('ProjectOrderEmployee') private readonly projectOrderEmployeeSchema: Model<any>,
    @InjectModel('ProjectOrderCustomer') private readonly projectOrderCustomerSchema: Model<any>,
    @InjectModel('ProjectOrderCamera') private readonly projectOrderCameraSchema: Model<any>,
    @InjectConnection() private readonly connection: mongoose.Connection
  ){}

  async create(user_id :string ,dto: CreateProjectOrderDto) {
    let session = await this.connection.startSession(); 
    session.startTransaction();
    let result;
    try {
      // 获取公司信息
      let company_info = await this.companySchema.findById(dto.company_id).session(session)
      if(company_info){
        if(company_info.audit_state != 0){
          // 不允许未通过审核的公司创建订单
          throw new BaseException(ResultCode.PROJECT_ORDER_COMPANY_NOT_AUDIT,{})
        }
      }else{
        //公司不存在
        throw new BaseException(ResultCode.COMPANY_NOT_EXIST,{})
      }
      let fzr_company_employee_id = null;
      // 获取公司员工
      let ce_info = await this.companyEmployeeSchema.findOne({ user_id : new Types.ObjectId(user_id) ,company_id:new Types.ObjectId(dto.company_id)}).session(session)
      if(ce_info){
        if(ce_info.identity_type == 0){
          // 0是普通员工、1是管理、2是创始人
          throw new BaseException(ResultCode.COMPANY_NOT_PERMISSION,{})
        }else{
          fzr_company_employee_id = ce_info._id.toString();
        }
      }else{
        // 如果该用户不是公司员工，他无权创建
        throw new BaseException(ResultCode.PROJECT_ORDER_NOT_PERMISSION,{})
      }

      if(!fzr_company_employee_id){
        throw new BaseException(ResultCode.PROJECT_ORDER_NOT_PERMISSION,{})
      }

      const projectOrder = new this.projectOrderSchema({
        name:dto.name,
        user_id: new Types.ObjectId(user_id),
        company_id: new Types.ObjectId(dto.company_id),
        customer :dto.customer,
        address : dto.address,
        phone:dto.phone,
        progress_template:dto.progress_template,
      })
      result = await projectOrder.save({ session })
      // 存放订单员工信息，这里目前没有自己
      let employee_ids = dto.employee_ids;
      // 此时将创建人加入到这个订单里
      employee_ids.push({
        _id :fzr_company_employee_id,  
        user_id,
      })
      // 防止万一有重复的员工添加到订单，那么此时去重这些人
      employee_ids = employee_ids.filter((item, index, arr) => { 
        return arr.findIndex(t => t.user_id === item.user_id) === index; 
      });

      // 创建后的订单id
      let project_order_id = result._id;
      let employees_schemas = employee_ids.map((item) => {
        return {
          user_id: new Types.ObjectId(item.user_id),
          project_order_id,
          company_employee_id :new Types.ObjectId(item._id)
        }
      })
      //将员工分配到订单里
      await this.projectOrderEmployeeSchema.insertMany(employees_schemas,{ session })
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BaseException(ResultCode.ERROR,{},error)
    }finally{
      await session.endSession();
    }
    return result;
  }

  async findAll(page :number ,limit :number ,options ? :object) {
    const curd = new CURD(this.projectOrderSchema)
    return curd.pagination(page,limit,options || {});
  }

  async findById(id :string) {
    return await this.projectOrderSchema.findById(id).populate('user_id company_id');
  }

  async updateById(id :string ,dto :any) {
    return await this.projectOrderSchema.findByIdAndUpdate(id,dto);
  }

  async remove(id :string) {
    let session = await this.connection.startSession(); 
    session.startTransaction();
    let result;
    try {
      
      let cameraList = await this.projectOrderCameraSchema.find({ project_order_id : new Types.ObjectId(id) });
      
      if(cameraList && cameraList.length > 0){
        let company_camera_ids = []
        cameraList.forEach((item) => {
          company_camera_ids.push(item.company_camera_id)
        })
        // 删除订单监控表，此时公司监控状态依旧为工作中
        await this.projectOrderCameraSchema.deleteMany({ project_order_id : new Types.ObjectId(id) }).session(session)
        // 根据订单监控表里的值修改所有在该订单内的公司监控状态为空闲
        await this.companyCameraSchema.updateMany({_id: {$in: company_camera_ids}},{ state :0 })
      }
      // 删除订单客户表，只有该表删除后，客户才不会在自己的订单列表显示订单
      await this.projectOrderCustomerSchema.deleteMany({ project_order_id : new Types.ObjectId(id) }).session(session)
      // 删除订单员工表，只有该表删除后，员工才不会在自己的订单列表显示订单
      await this.projectOrderEmployeeSchema.deleteMany({ project_order_id : new Types.ObjectId(id) }).session(session)
      // 删除订单笔记
      await this.projectOrderNoteSchema.deleteMany({ project_order_id : new Types.ObjectId(id) }).session(session)
      // 删除订单
      result = await this.projectOrderSchema.findByIdAndRemove(id).session(session)

      // throw new BaseException(ResultCode.ERROR,{})

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BaseException(ResultCode.ERROR,{},error)
    }finally{
      await session.endSession();
    }
    return result;
  }

  /**
   * 转移项目，实际上是修改了项目订单的user_id
   * @param id 项目ID
   * @param send_user_id 转交人ID
   * @param recv_user_id 接受人ID
   * @returns 
   */
  async handOver(dto :ProjectOrderHandOverDto){
    let session = await this.connection.startSession(); 
    session.startTransaction();
    let result;
    try {
      // 获取订单消息
      let po_info = await this.projectOrderSchema.findById(dto.id).session(session);

      if(!po_info){
        throw new BaseException(ResultCode.PROJECT_ORDER_IS_NOT,{})
      }

      // 获取订单所属的公司
      let company_id = po_info.company_id;

      // 查看公司所属的员工
      let ce_info = await this.companyEmployeeSchema.findOne({ company_id ,user_id :new Types.ObjectId(dto.recv_user_id) }).session(session)

      if(!ce_info){
        // 接受人不属于该公司
        throw new BaseException(ResultCode.COMPANY_EMPLOYEE_IS_NOT)
      }

      // 查看员工是否在该订单内
      let poe_info = await this.projectOrderEmployeeSchema.findOne({ 
        project_order_id : new Types.ObjectId(dto.id), 
        user_id :new Types.ObjectId(dto.recv_user_id),
        company_employee_id : ce_info._id
      }).session(session)

      console.log(poe_info)

      if(poe_info){
        // 如果该员工在订单里，则直接修改
        result = await this.projectOrderSchema.findByIdAndUpdate(dto.id,{ user_id :new Types.ObjectId(dto.recv_user_id) }).session(session)
        console.log('员工在订单内')
      }else{
        // 把他加入到订单内，在修改
        const poe_schema = new this.projectOrderEmployeeSchema({ 
          user_id :new Types.ObjectId(dto.recv_user_id), 
          project_order_id :new Types.ObjectId(dto.id),
          company_employee_id :new Types.ObjectId(ce_info._id)
        })
        await poe_schema.save({ session })
        result = await this.projectOrderSchema.findByIdAndUpdate(dto.id,{ user_id :new Types.ObjectId(dto.recv_user_id) }).session(session)
        console.log('员工不在订单内')
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

  async finish(id :string) {
    let session = await this.connection.startSession(); 
    session.startTransaction();
    let result;
    try {
      let op_info = await this.projectOrderSchema.findById(id).session(session);
      if(!op_info){
        throw new BaseException(ResultCode.PROJECT_ORDER_IS_NOT,{})
      }
      let progress_template = op_info.progress_template;
      let step = progress_template.length - 1 || 0;
      // 完成订单后需要将所有公司监控变为可分配
      let cameraList = await this.projectOrderCameraSchema.find({ project_order_id : new Types.ObjectId(id) });
      if(cameraList && cameraList.length > 0){
        let company_camera_ids = []
        cameraList.forEach((item) => {
          company_camera_ids.push(item.company_camera_id)
        })
        // 删除订单监控表，此时公司监控状态依旧为工作中
        await this.projectOrderCameraSchema.deleteMany({ project_order_id : new Types.ObjectId(id) }).session(session)
        // 根据订单监控表里的值修改所有在该订单内的公司监控状态为空闲
        await this.companyCameraSchema.updateMany({_id: {$in: company_camera_ids}},{ state :0 })
      }
      // 修改订单状态为完成，步数则为顶
      result = await this.projectOrderSchema.findByIdAndUpdate(id,{ step ,state: 1 }).session(session)
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
