import { Injectable } from '@nestjs/common';
import { CreateProjectOrderDto } from './dto/create-project_order.dto';
import { UpdateProjectOrderDto } from './dto/update-project_order.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { CURD } from 'src/shared/utils/curd.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { uniqueArray } from 'src/shared/utils/tools.util';

@Injectable()
export class ProjectOrderService {

  constructor(
    @InjectModel('ProjectOrder') private readonly projectOrderSchema: Model<any>,
    @InjectModel('ProjectOrderEmployee') private readonly projectOrderEmployeeSchema: Model<any>,
    @InjectConnection() private readonly connection: mongoose.Connection
  ){}

  async create(user_id :string ,dto: CreateProjectOrderDto) {
    let session = await this.connection.startSession(); 
    session.startTransaction();
    let result;
    try {
      const projectOrder = new this.projectOrderSchema({
        name:dto.name,
        user_id: new Types.ObjectId(user_id),
        company_id:dto.company_id,
        customer :dto.customer,
        address : dto.address,
        phone:dto.phone,
        progress_template:dto.progress_template,
      })
      result = await projectOrder.save({ session })
      let employee_ids = dto.employee_ids;
      employee_ids.push({
        _id :null,  //公司员工ID，为空相当于是负责人
        user_id,
      })
      // 去重数组
      employee_ids = employee_ids.filter((item, index, arr) => { 
        return arr.findIndex(t => t.user_id === item.user_id) === index; 
      });
      let project_order_id = result._id
      let employees_schemas = employee_ids.map((item) => {
        let io_employee = {
          user_id: new Types.ObjectId(item.user_id),
          project_order_id
        }
        if(item._id){
          io_employee = Object.assign(io_employee,{ company_employee_id: new Types.ObjectId(item._id) })
        }
        return io_employee
      })
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

  findOne(id: number) {
    return `This action returns a #${id} projectOrder`;
  }

  update(id: number, updateProjectOrderDto: UpdateProjectOrderDto) {
    return `This action updates a #${id} projectOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectOrder`;
  }
}
