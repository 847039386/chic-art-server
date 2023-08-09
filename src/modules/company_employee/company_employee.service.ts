import { Injectable } from '@nestjs/common';
import { CreateCompanyEmployeeDto } from './dto/create-company_employee.dto';
import { UpdateCompanyEmployeeDto } from './dto/update-company_employee.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class CompanyEmployeeService {

  constructor(
    @InjectModel('CompanyEmployee') private readonly companyEmployeeSchema: Model<CreateCompanyEmployeeDto>,
  ){}

  async create(dto: CreateCompanyEmployeeDto) {
    const companyEmployee = new this.companyEmployeeSchema({
      user_id :new Types.ObjectId(dto.user_id),
      company_id :new Types.ObjectId(dto.company_id)
    })
    return await companyEmployee.save()
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
