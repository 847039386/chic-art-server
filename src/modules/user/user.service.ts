import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto, SearchUserDto } from './dto/create-user.dto';
import { sonsTree, treeFormat } from 'src/shared/utils/tree.util';


@Injectable()
export class UserService {

  constructor(
    @InjectModel('User') private readonly userSchema: Model<any>,
    @InjectModel('UserGroup') private readonly userGroupSchema: Model<any>,
    @InjectModel('UserGroupUser') private readonly userGroupUserSchema: Model<any>,
    @InjectModel('UserGroupRole') private readonly userGroupRoleSchema: Model<any>,
    @InjectModel('RolePermission') private readonly rolePermissionSchema: Model<any>,
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
            nickname :{ $first: "$nickname" },
            phone :{ $first: "$phone" },
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
    let total = result[0].total || 0
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
 
  async updateInfoById(id ,data: any) {
    return await this.userSchema.findByIdAndUpdate(id ,data)
  }

  async findById(id :string) {
    return await this.userSchema.findById(id)
  }

  

  /**
   * 该方法返回用户所在的用户组包括子组，用户的所有权限，用户的所有角色，这里不返回没有开启的角色用户组与权限
   * @param user_id 用户ID
   * @returns 
   */
  async getUserURP (user_id) {
    let user_group_all = await this.userGroupSchema.find({available:true},{ _id :1,parent_id:1,name:1 ,available :1}).lean()
    let user_group = await this.userGroupUserSchema.find({ user_id :new Types.ObjectId(user_id) }).populate('user_group_id')
    let allUserGroup = []
    let allUserGroupIds = []
    let roles = []
    let permissions = []
    if(user_group && user_group.length > 0){
      // 获取用户所在的用户组包括这个用户组以下所有的子集，子集即存在父级便拥有
      user_group.forEach((element :any) => {
        let children = sonsTree(treeFormat(user_group_all),element.user_group_id._id)
        if(element.user_group_id.available){
          allUserGroup.push({_id :element.user_group_id._id ,name:element.user_group_id.name ,parent_id: element.user_group_id.parent_id || null })
        }
        if(children.length > 0){
         
          children.forEach((item) => {
            allUserGroup.push({_id :item._id ,name:item.name ,parent_id: item.parent_id || null})
          })
        }
      })
      // 同上把所有子集与父级的id获取存在allUserGroupIds数组里
      if(allUserGroup.length > 0){
        allUserGroup.forEach((element) => {
          allUserGroupIds.push(element._id)
        })
      }
      // 根据用户所在用户组查找用户所拥有的所有角色
      if(allUserGroupIds.length > 0){
        let objeids = []
        allUserGroupIds.forEach(element => {
          objeids.push(new Types.ObjectId(element))
        });
        let u_roles = await this.userGroupRoleSchema.find({ user_group_id :{$in: objeids} }).populate({path:'role_id',select:{ name:1 , available :1}}).select({role_id:1,_id:0})
        if(u_roles.length > 0){
          u_roles.forEach((element :any) => {
            if(element.role_id.available){
              roles.push({_id :element.role_id._id ,name :element.role_id.name })
            }
          })
        }
      }
      // 根据所拥有的角色查看用户所拥有的所有权限
      if(roles.length > 0){
        let objeids = [];
        roles.forEach((element :any) => {
          objeids.push(new Types.ObjectId(element._id))
        })
        let u_permissions = await this.rolePermissionSchema.find({ role_id :{$in: objeids} }).populate({path:'permission_id',select:{ name:1 ,code:1 , available :1}}).select({permission_id:1,_id:0})
        u_permissions.forEach((element :any) => {
          if(element.permission_id.available){
            permissions.push({_id :element.permission_id._id ,name :element.permission_id.name , code :element.permission_id.code })
          }
        })
      }

      /**
       * 因为每个角色可能会有相同的权限，这里将权限去重。
       * 这里的权限可能是父级也可能是子集 所有在判断权限的时候先去数据库查找是否有这条权限在根据权限去查找这个权限的父级。
       * 权限与权限父级有一条存在即可通过，具体逻辑查看守卫
       */
      if(permissions.length > 0){
        let peobje = {}
        permissions = permissions.reduce(function (item, next) {
          peobje[next._id] ? '' : peobje[next._id] = true && item.push(next)
          return item
        }, [])
      }
      
    }
    return {groups :allUserGroup ,roles ,permissions}
  }
}
