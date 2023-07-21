import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class TagService {

  constructor(
    @InjectModel('Tag') private readonly tagSchema: Model<CreateTagDto>,
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
    return await this.tagSchema.findByIdAndRemove(id)
  }

  async findAll() {
    return this.tagSchema.find({})
  }

}
