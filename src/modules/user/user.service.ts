import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto, SearchUserDto } from './dto/create-user.dto';
import { UpdateUserInfoDto ,UpdateUserStateDto} from './dto/update-user.dto';
import { CreateUserGroupUserDto } from '../user_group_user/dto/create-user_group_user.dto';
import { CreateUserGroupRoleDto } from '../user_group_role/dto/create-user_group_role.dto';
import { sonsTree, treeFormat } from 'src/shared/utils/tree.util';


@Injectable()
export class UserService {

  constructor(
    @InjectModel('User') private readonly userSchema: Model<CreateUserDto>,
    @InjectModel('UserGroup') private readonly userGroupSchema: Model<CreateUserGroupUserDto>,
    @InjectModel('UserGroupUser') private readonly userGroupUserSchema: Model<CreateUserGroupUserDto>,
    @InjectModel('UserGroupRole') private readonly userGroupRoleSchema: Model<CreateUserGroupRoleDto>,
  ) { }
  
  async create(createUserDto: CreateUserDto) {
    const user = new this.userSchema(createUserDto)
    return await user.save();
  }

  async findAll(dto :SearchUserDto) {
    
    let match = {}
    let page = dto.page || 1
    let limit = dto.limit || 10
    if(dto){
      if(dto.name){
        match = Object.assign(match,{ name :new RegExp(dto.name,'i') })
      }
      if(typeof dto.state != 'undefined' && dto.state != null){
        match = Object.assign(match,{ state :dto.state})
      }
    }


    let result :any = await this.userSchema.aggregate([
        {
          $match: match
        },
        {
          $lookup:{
            from:'user_group_user',  // 关联的集合
            localField:'_id',  // 本地关联的字段
            foreignField:'user_id',  // 对方集合关联的字段
            as:'group',  // 结果字段名,
          },
        },
        {
          $unwind: {
            path:"$group",
            preserveNullAndEmptyArrays:true,
          } 
        },
        {
          $lookup: {
            from: "user_group",
            localField: "group.user_group_id",
            foreignField: "_id",
            as: 'group.user_group'
          }
        },
        
        {
          $group: {
            _id : "$_id",
            name: { $first: "$name" },
            state: { $first: "$state" },
            avatar: { $first: "$avatar" },
            create_time :{$first: "$create_time"},
            group: { $push:'$group'},
          }
        },
        {
          $facet :{
            total: [{ $count:"count" }],
            rows:[
              { $skip:(page - 1) * limit },
              { $limit: limit} ,
              {$sort :{ "create_time": 1 }}
            ]
          }
        },
        {
          $project: {
              data:'$rows',
              total: {$arrayElemAt: [ "$total.count", 0 ]},
              
          }
        },
    ])
    let rows = result[0].data
    let total = result[0].total
    if(rows && rows.length){
      rows = rows.map((item) => {
        if(item.group[0] && item.group[0].user_group.length == 0){
          item.group = [];
        }
        return item;
      })
      
      rows = rows.map((item) => {
        if(item.group.length > 0){
          item.group = item.group.map((element) => {
            element.user_group = element.user_group[0]
            return element
          })
        }
        return item
      })

    }

    return {
      currentPage :page,
      pageSize :limit,
      totalPage: total ? Math.ceil(total / limit) : 1,
      total :total,
      rows :rows
    };
  }
 
  async updateInfo(dto: UpdateUserInfoDto) {
    return await this.userSchema.findByIdAndUpdate(dto.id,{
      name :dto.name,
    })
  }

  async updateState(dto: UpdateUserStateDto) {
    return await this.userSchema.findByIdAndUpdate(dto.id,{
      state :dto.state,
    })
  }

  async getUserURP (user_id) {
    let user_group_all = await this.userGroupSchema.find({},{ _id :1,parent_id:1,name:1}).lean()
    
    let user_group = await this.userGroupUserSchema.find({ user_id :new Types.ObjectId(user_id) }).populate('user_group_id')
    let user_group_ids = []
    let user_group_role = []
    let children_s = []
    if(user_group && user_group.length > 0){
      user_group.forEach((element :any) => {
        user_group_ids.push(element.user_group_id)
        let children = sonsTree(treeFormat(user_group_all),element.user_group_id._id).concat({ _id :element.user_group_id._id ,name:element.user_group_id.name ,parent_id:element.user_group_id.parent_id})
        children_s.push(children)
      })

      user_group_role = await this.userGroupRoleSchema.find({ user_group_id :{$in: user_group_ids} })
    }

    return {user_group_ids,children_s}
  }
}
