import { Injectable } from '@nestjs/common';
import { CreateUserGroupDto } from './dto/create-user_group.dto';
import { UpdateUserGroupInfoDto } from './dto/update-user_group.dto';
import { InjectModel ,InjectConnection } from '@nestjs/mongoose';
import mongoose ,{ Model, Types } from 'mongoose';
import { getTreeIds, sonsTree, treeFormat } from 'src/shared/utils/tree.util';
import { CreateUserGroupRoleDto } from '../user_group_role/dto/create-user_group_role.dto';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { CreateUserGroupUserDto } from '../user_group_user/dto/create-user_group_user.dto';

@Injectable()
export class UserGroupService {

  constructor(
    @InjectModel('UserGroup') private readonly userGroupSchema: Model<CreateUserGroupDto>,
    @InjectModel('UserGroupRole') private readonly userGroupRoleSchema: Model<CreateUserGroupRoleDto>,
    @InjectModel('UserGroupUser') private readonly userGroupUserSchema: Model<CreateUserGroupUserDto>,
    @InjectConnection() private readonly connection: mongoose.Connection
    ){}

  async create(dto: CreateUserGroupDto) {
    const userGroup = new this.userGroupSchema(dto)
    return await userGroup.save();
  }

  async findAll() {
    // return this.userGroupSchema.find({},{}).lean()
    return await this.userGroupSchema.aggregate([
      {
        $lookup:{
          from:'user_group_role',  // 关联的集合
          localField:'_id',  // 本地关联的字段
          foreignField:'user_group_id',  // 对方集合关联的字段
          as:'roles',  // 结果字段名,
        },
      },
      {
        $unwind: {
          path:"$roles",
          preserveNullAndEmptyArrays:true,
        } 
      },
      {
        $lookup: {
          from: "role",
          localField: "roles.role_id",
          foreignField: "_id",
          as: 'roles.role'
        }
      },
      {
        $group: {
          _id : "$_id",
          name: { $first: "$name" },
          type :{ $first: "$type" },
          parent_id :{$first: "$parent_id"},
          available: { $first: "$available" },
          create_time :{$first: "$create_time"},
          description :{ $first: "$description" },
          roles: { $push:'$roles'}
        }
      },
      { $sort: { "create_time": 1 } },
      { 
        $project: { 
          "roles.create_time":0, 
          "roles.update_time" : 0, 
          "roles.__v" :0, 
        } 
      },
  ])
  }


  async updateInfo(dto: UpdateUserGroupInfoDto) {
    return await this.userGroupSchema.findByIdAndUpdate(dto.id ,{
      name : dto.name,
      type : dto.type || 0,
      description :dto.description
    });
  }

  async updateAvailable(ids: string [],available :boolean) {
    return await this.userGroupSchema.updateMany({_id: {$in: ids}},{ available })
  }
  
  // 该方法传入权限id 将会删除他下面所有的子集，这其中包括他自己
  async remove(id: string) {
    let session = await this.connection.startSession(); 
    session.startTransaction();
    let result;
    try {
      // 查询所有组
      let userGroups = await this.userGroupSchema.find({},{}).lean().session(session)
      // 根据ID查询该组下所有成员
      let children = sonsTree(treeFormat(userGroups),id)
      // 返回一个只有id的数组，在加上要删除的ID
      let ids = getTreeIds(children).concat(id)
      // 删除该组和该组的子集
      result = await this.userGroupSchema.deleteMany({_id: {$in: ids}}).session(session)
      // 循环改成将ids改成ObjectId
      let o_ids = [];
      ids.forEach((item) => {
        o_ids.push(new Types.ObjectId(item))
      })
      // 删除用户组角色表中与该组关联的角色，包括组和组的子集
      await this.userGroupRoleSchema.deleteMany({ user_group_id : {$in: o_ids } }).session(session)
      // 删除与用户组用户表中与该组关联的用户，包括组和组的子集
      await this.userGroupUserSchema.deleteMany({ user_group_id : {$in: o_ids } }).session(session)
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BaseException(ResultCode.ERROR,{},error)
    }finally{
      await session.endSession();
    }
    return result;
  }
}
