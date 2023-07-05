import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionService {

  constructor(@InjectModel('Permission') private readonly requestLogSchema: Model<CreatePermissionDto>) { }

  async create(createPermissionDto: CreatePermissionDto) {
    const permission = new this.requestLogSchema(createPermissionDto)
    return await permission.save();
  }


  findAll() {
    return this.requestLogSchema.find({},{}).lean()
  }


  updateAvailable(id: string,available :boolean) {
    return this.requestLogSchema.findByIdAndUpdate(id,{ available })
  }

  async remove(id: string) {
    let _id = new Types.ObjectId(id)
    return this.requestLogSchema.findByIdAndDelete(_id);
  }
}
