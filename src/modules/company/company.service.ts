import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto, UpdateCompanyWeightDto ,UpdateCompanyStateDto ,UpdateCompanyLogoDto ,UpdateCompanyNameDto, UpdateCompanyDescriptionDto ,UpdateCompanyTagDto, UpdateCompanyAddressDto } from './dto/update-company.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { CURD } from 'src/shared/utils/curd.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';

@Injectable()
export class CompanyService {

  constructor(
    @InjectModel('Company') private readonly companySchema: Model<any>,
    @InjectModel('Message') private readonly messageSchema: Model<any>,
    @InjectModel('CompanyEmployee') private readonly companyEmployeeSchema: Model<any>,
    @InjectConnection() private readonly connection: mongoose.Connection
    ){}


  async create(user_id :string ,dto: CreateCompanyDto) {

    let session = await this.connection.startSession(); 
    session.startTransaction();
    let result;
    try {

      // 创建公司
      const company = new this.companySchema({
        logo:dto.logo,
        user_id: new Types.ObjectId(user_id),
        name : dto.name,
        description :dto.description,
        tag_ids :dto.tag_ids,
        address: dto.address || '未填写地址'
      })
      result = await company.save({session});

      // 在将创始人添加到公司员工列表中
      const companyEmployee = new this.companyEmployeeSchema({
        user_id :new Types.ObjectId(user_id),
        company_id :new Types.ObjectId(result._id),
        remark :'创始人',
        audit_state :1, // 审核一定是通过的因为添加人是他自己
        identity_type :2 //身份2是创始人
      })

      await companyEmployee.save({session});

      const message = new this.messageSchema({
        type:0,
        title:'系统消息',
        content :`您创建的公司：${dto.name} 已经成功，管理员将在1-3个工作日审核信息，请耐心等待。`,
        recv_user_id :new Types.ObjectId(user_id)
      })
      await message.save({ session })


      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BaseException(ResultCode.ERROR,{},error)
    }finally{
      await session.endSession();
    }
    return result;
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
