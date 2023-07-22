import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateCompanyDto } from '../company/dto/create-company.dto';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';

@Injectable()
export class TagService {

  constructor(
    @InjectModel('Tag') private readonly tagSchema: Model<CreateTagDto>,
    @InjectModel('Company') private readonly companySchema: Model<CreateCompanyDto>,
    @InjectConnection() private readonly connection: mongoose.Connection
    ) { }

  async create(dto: CreateTagDto) {
    const tag = new this.tagSchema(dto)
    return await tag.save()
  }

  async isExist(name :string){
    let result = await this.tagSchema.findOne({ name })
    return result ? true : false
  }

  async updateInfo(dto: UpdateTagDto) {
    return await this.tagSchema.findByIdAndUpdate(dto.id,{
      name :dto.name,
    })
  }

  async remove(id :string) {
    let session = await this.connection.startSession(); 
    session.startTransaction();
    let result;
    try {
      // 查询所有组
      // let userGroups = await this.userGroupSchema.find({},{}).lean().session(session)
      await this.companySchema.updateMany({ tag_ids :{ $elemMatch : { $eq: id } }},{$pull:{ tag_ids :{ $eq: id } }}).session(session)
      result = await this.tagSchema.findByIdAndRemove(id).session(session)
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BaseException(ResultCode.ERROR,{},error)
    }finally{
      await session.endSession();
    }
    return result;
  }

  async findAll() {
    return this.tagSchema.find({})
  }

}
