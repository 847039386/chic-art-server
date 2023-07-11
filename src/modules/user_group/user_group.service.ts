import { Injectable } from '@nestjs/common';
import { CreateUserGroupDto } from './dto/create-user_group.dto';
import { UpdateUserGroupInfoDto ,UpdateUserGroupAvailableDto } from './dto/update-user_group.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getTreeIds, sonsTree, treeFormat } from 'src/shared/utils/tree.util';

@Injectable()
export class UserGroupService {

  constructor(@InjectModel('UserGroup') private readonly userGroupSchema: Model<CreateUserGroupDto>) { }

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
    let result = await this.userGroupSchema.find({},{}).lean()
    let children = sonsTree(treeFormat(result),id)
    let ids = getTreeIds(children).concat(id)
    return await this.userGroupSchema.deleteMany({_id: {$in: ids}});
  }
}
