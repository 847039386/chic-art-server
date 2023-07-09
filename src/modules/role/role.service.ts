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
    
    return await this.roleSchema.aggregate([
        {
          $lookup:{
            from:'role_permission',  // 关联的集合
            localField:'_id',  // 本地关联的字段
            foreignField:'role_id',  // 对方集合关联的字段
            as:'permissions',  // 结果字段名,
          },
        },
        {
          $unwind: {
            path:"$permissions",
            preserveNullAndEmptyArrays:true,
          } 
        },
        {
          $lookup: {
            from: "permission",
            localField: "permissions.permission_id",
            foreignField: "_id",
            as: 'permissions.permission'
          }
        },
        {
          $group: {
            _id : "$_id",
            name: { $first: "$name" },
            available: { $first: "$available" },
            create_time :{$first: "$create_time"},
            description :{ $first: "$description" },
            permissions: { $push:'$permissions'}
          }
        },
        { $sort: { "create_time": 1 } },
        { 
          $project: { 
            "permissions.create_time":0, 
            "permissions.update_time" : 0, 
            "permissions.__v" :0, 
          } 
        },
    ])

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

