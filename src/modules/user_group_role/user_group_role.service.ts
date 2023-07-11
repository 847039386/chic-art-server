import { Injectable } from '@nestjs/common';
import { CreateUserGroupRoleDto } from './dto/create-user_group_role.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserGroupRoleService {

  constructor(@InjectModel('UserGroupRole') private readonly userGroupRoleSchema: Model<CreateUserGroupRoleDto>) { }

  async create(dto: CreateUserGroupRoleDto) {
    let role_id = new Types.ObjectId(dto.role_id)
    let user_group_id = new Types.ObjectId(dto.user_group_id)
    const rolePermission = new this.userGroupRoleSchema({role_id,user_group_id})
    return await rolePermission.save()
  }

  // 删除单条角色
  async remove(id: string) {
    return await this.userGroupRoleSchema.findByIdAndRemove(id);
  }

  // 判断角色权限是否存在
  async isExist(dto: CreateUserGroupRoleDto){
    let result = await this.userGroupRoleSchema.findOne({ role_id: new Types.ObjectId(dto.role_id) ,user_group_id:new Types.ObjectId(dto.user_group_id)})
    return result ? true : false
  }

  //该用户组下拥有的角色
  async geRolesByUserGroupId(user_group_id){
    return await this.userGroupRoleSchema.find({ user_group_id :new Types.ObjectId(user_group_id)}).populate('role_id')
  }

  // 删除角色下的权限列表
  async deletePermissionIds(role_id :string ,ids: string []) {
    let o_ids = [];
    ids.forEach((item) => {
      o_ids.push(new Types.ObjectId(item))
    })
    return await this.userGroupRoleSchema.deleteMany({ role_id :new Types.ObjectId(role_id),permission_id: {$in: o_ids}});
  }

}
