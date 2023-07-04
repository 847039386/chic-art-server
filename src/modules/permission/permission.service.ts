import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

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

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
