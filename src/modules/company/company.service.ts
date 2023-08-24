import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto, UpdateCompanyWeightDto ,UpdateCompanyStateDto ,UpdateCompanyLogoDto ,UpdateCompanyNameDto, UpdateCompanyDescriptionDto ,UpdateCompanyTagDto, UpdateCompanyAddressDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CURD } from 'src/shared/utils/curd.util';

@Injectable()
export class CompanyService {

  constructor(
    @InjectModel('Company') private readonly companySchema: Model<any>,
    ){}


  async create(user_id :string ,dto: CreateCompanyDto) {

    const company = new this.companySchema({
      logo:dto.logo,
      user_id: new Types.ObjectId(user_id),
      name : dto.name,
      description :dto.description,
      tag_ids :dto.tag_ids,
      address: dto.address || '未填写地址'
    })
    return await company.save()
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

  async updateLogo(dto: UpdateCompanyLogoDto) {
    return await this.companySchema.findByIdAndUpdate(dto.id,{
      logo:dto.logo
    })
  }

  async updateName(dto: UpdateCompanyNameDto) {
    return await this.companySchema.findByIdAndUpdate(dto.id,{
      name:dto.name
    })
  }

  async updateDescription(dto: UpdateCompanyDescriptionDto) {
    return await this.companySchema.findByIdAndUpdate(dto.id,{
      description:dto.description
    })
  }

  async updateTag(dto: UpdateCompanyTagDto) {
    let tag_ids = dto.tag_ids.map((item) =>{
      return new Types.ObjectId(item)
    })
    return await this.companySchema.findByIdAndUpdate(dto.id,{
      tag_ids
    })
  }

  async updateAddress(dto: UpdateCompanyAddressDto) {
    return await this.companySchema.findByIdAndUpdate(dto.id,{
      address :dto.address
    })
  }

  async findById(id :string) {
    return await this.companySchema.findById(id).populate('user_id tag_ids')
  }

  async findByUserId(id :string) {
    return await this.companySchema.findOne({ user_id : new Types.ObjectId(id)}).populate('user_id tag_ids')
  }

  async remove(id :string) {
    return await this.companySchema.findByIdAndRemove(id)
  }

  async findAll(page :number ,limit :number ,options ? :object) {
    const curd = new CURD(this.companySchema)
    return curd.pagination(page,limit,options || {});
  }

  // 审核通过则更改值
  async auditAllow(id :string){
    return await this.companySchema.findByIdAndUpdate(id,{
      audit_state:0
    })
  }

  // 审核拒绝后将状态改为不通过
  async auditNotAllow(id){
    return await this.companySchema.findByIdAndUpdate(id,{
      audit_state:2
    })
  }

}
