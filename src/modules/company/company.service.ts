import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto, UpdateCompanyWeightDto ,UpdateCompanyStateDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CURD } from 'src/shared/utils/curd.util';

@Injectable()
export class CompanyService {

  constructor(
    @InjectModel('Company') private readonly companySchema: Model<CreateCompanyDto>,
    ){}


  async create(dto: CreateCompanyDto) {
    const tag = new this.companySchema({
      user_id: new Types.ObjectId(dto.user_id),
      name : dto.name,
      description :dto.description,
      tag_ids :dto.tag_ids
    })
    return await tag.save()
  }

  // 根据公司名查找公司是否重复
  async isExist(name :string){
    let result = await this.companySchema.findOne({ name })
    return result ? true : false
  }

  // 用户是否创建了公司
  async userIsExist(user_id :string){
    let result = await this.companySchema.findOne({ user_id :new Types.ObjectId(user_id) })
    return result ? true : false
  }

  async updateInfo(dto: UpdateCompanyDto) {
    return await this.companySchema.findByIdAndUpdate(dto.id,{
      name :dto.name,
    })
  }

  async updateWeight(dto: UpdateCompanyWeightDto) {
    return await this.companySchema.findByIdAndUpdate(dto.id,{
      weight:dto.weight
    })
  }

  async updateState(dto: UpdateCompanyStateDto) {
    return await this.companySchema.findByIdAndUpdate(dto.id,{
      state:dto.state
    })
  }

  async findById(id :string) {
    return this.companySchema.findById(id)
  }

  async remove(id :string) {
    return await this.companySchema.findByIdAndRemove(id)
  }

  async findAll(page :number ,limit :number ,options ? :object) {
    const curd = new CURD(this.companySchema)
    return curd.pagination(page,limit,options || {});
  }

  // 审核通过则更改值
  async censorAllow(id :string){
    return await this.companySchema.findByIdAndUpdate(id,{
      censor:0
    })
  }

  // 审核拒绝后将状态改为不通过
  async censorNotAllow(id){
    return await this.companySchema.findByIdAndUpdate(id,{
      censor:2
    })
  }

}
