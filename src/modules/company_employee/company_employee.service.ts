import { Injectable } from '@nestjs/common';
import { CreateCompanyEmployeeDto } from './dto/create-company_employee.dto';
import { UpdateCompanyEmployeeDto } from './dto/update-company_employee.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';

@Injectable()
export class CompanyEmployeeService {

  constructor(
    @InjectModel('Company') private readonly companySchema: Model<any>,
    @InjectModel('CompanyEmployee') private readonly companyEmployeeSchema: Model<any>,
    @InjectConnection() private readonly connection: mongoose.Connection
  ){}

  async create(user_id :string,company_id :string) {
    const companyEmployee = new this.companyEmployeeSchema({
      user_id :new Types.ObjectId(user_id),
      company_id :new Types.ObjectId(company_id)
    })
    return await companyEmployee.save()
  }

  async findOne(query){
    return await this.companyEmployeeSchema.findOne(query)
  }

  async findEmployeesByCompanyId(company_id) {
    return await this.companyEmployeeSchema.find({company_id:new Types.ObjectId(company_id)}).populate('user_id')
  }

  async updateById(id ,newData) {
    return await this.companyEmployeeSchema.findByIdAndUpdate(id,newData)
  }

  async updateMany(filter ,data) {
    return await this.companyEmployeeSchema.updateMany(filter,data)
  }

  async remove(id: string) {
    return await this.companyEmployeeSchema.findByIdAndRemove(id)
  }

  // 是否可操作，这里不是管理员权限，只有员工权限
  async isAllowOperate(company_id :string ,user_id :string){
    let e_company = await this.companyEmployeeSchema.findOne({ 
      user_id :new Types.ObjectId(user_id) , 
      company_id :new Types.ObjectId(company_id)
    }).populate('company_id')
    let company = e_company.company_id;
    let identity_type = e_company.identity_type;
    if(company.user_id == user_id){
      console.log('是创始人操作')
      // 允许创始人操作
      return true
    }else{
      // 允许管理员操作
      if(identity_type == 2){
        console.log('是管理员操作')
        return true
      }
      console.log('员工')
    }
    return false
  }

  async updateEmployeeIdentityType(id :string ,identity_type :number) {
    switch (identity_type) {
      case 1:
        break;
      default:
        identity_type = 0
        break;
    }
    return await this.companyEmployeeSchema.findByIdAndUpdate(id,{
      identity_type
    })
  }

}
