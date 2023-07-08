import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleAvailableDto ,UpdateRoleInfoDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RoleService {

  constructor(@InjectModel('Role') private readonly roleSchema: Model<CreateRoleDto>) { }

  async create(createRoleDto: CreateRoleDto) {
    const role = new this.roleSchema(createRoleDto)
    return await role.save()
  }

  async findAll() {
    return await this.roleSchema.find();
  }

  async update(updateRoleDto: UpdateRoleInfoDto) {
    return await this.roleSchema.findByIdAndUpdate(updateRoleDto.id ,{
      name : updateRoleDto.name,
      description :updateRoleDto.description
    });
  }

  async updateAvailable(updateRoleDto: UpdateRoleAvailableDto) {
    return await this.roleSchema.findByIdAndUpdate(updateRoleDto.id ,{
      available :updateRoleDto.available      
    });
  }

  remove(id: string) {
    return this.roleSchema.findByIdAndRemove(id);
  }

}

