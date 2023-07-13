import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleAvailableDto ,UpdateRoleInfoDto } from './dto/update-role.dto';
import { InjectModel ,InjectConnection } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { CreateRolePermissionDto } from '../role_permission/dto/create-role_permission.dto';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { CreateUserGroupRoleDto } from '../user_group_role/dto/create-user_group_role.dto';

@Injectable()
export class RoleService {
  
  constructor(
    @InjectModel('Role') private readonly roleSchema: Model<CreateRoleDto> ,
    @InjectModel('RolePermission') private readonly rolePermissionSchema: Model<CreateRolePermissionDto>,
    @InjectModel('UserGroupRole') private readonly userGroupRoleSchema: Model<CreateUserGroupRoleDto>,
    @InjectConnection() private readonly connection: mongoose.Connection
    ){}

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

  async updateInfo(dto: UpdateRoleInfoDto) {
    return await this.roleSchema.findByIdAndUpdate(dto.id ,{
      name : dto.name,
      description :dto.description
    });
  }

  async updateAvailable(dto: UpdateRoleAvailableDto) {
    return await this.roleSchema.findByIdAndUpdate(dto.id ,{
      available :dto.available      
    });
  }
  
  async remove(id: string) {
    let session = await this.roleSchema.startSession(); 
    let session2 = await this.rolePermissionSchema.startSession();
    let session3 = await this.rolePermissionSchema.startSession();
    session.startTransaction();
    session2.startTransaction();
    session3.startTransaction();
    let result;
    try {
      // 删除角色ID
      result = this.roleSchema.findByIdAndRemove(id);
      // 删除与角色权限表的关联
      await this.rolePermissionSchema.deleteMany({ role_id : new Types.ObjectId(id)})
      // 删除与用户组角色直接按的关联
      console.log(await this.userGroupRoleSchema.deleteMany({ role_id : new Types.ObjectId('id') }))
      await session.commitTransaction();
      await session2.commitTransaction();
      await session3.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      await session2.abortTransaction();
      await session3.abortTransaction();
      throw new BaseException(ResultCode.ERROR,{},error)
    } finally {
      console.log('finally')
      session.endSession();
      session2.endSession();
      session3.endSession();
    }
    return result;
  }

}

