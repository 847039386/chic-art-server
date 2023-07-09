import { Injectable } from '@nestjs/common';
import { CreateRolePermissionDto } from './dto/create-role_permission.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RolePermissionService {

  constructor(@InjectModel('RolePermission') private readonly rolePermissionSchema: Model<CreateRolePermissionDto>) { }

  // 创建一条权限
  async create(dto: CreateRolePermissionDto) {
    let role_id = new Types.ObjectId(dto.role_id)
    let permission_id = new Types.ObjectId(dto.permission_id)
    const rolePermission = new this.rolePermissionSchema({role_id,permission_id})
    return await rolePermission.save()
  }

  // 删除单条权限
  async remove(id: string) {
    return await this.rolePermissionSchema.findByIdAndRemove(id);
  }

  // 判断角色权限是否存在
  async isExist(dto: CreateRolePermissionDto){
    let result = await this.rolePermissionSchema.findOne({ role_id: new Types.ObjectId(dto.role_id) ,permission_id:new Types.ObjectId(dto.permission_id)})
    return result ? true : false
  }

  //该角色下拥有的权限
  async getPermissionByRoleId(role_id){
    return await this.rolePermissionSchema.find({ role_id :new Types.ObjectId(role_id)})
  }

  // 删除角色下的权限列表
  async deletePermissionIds(role_id :string ,ids: string []) {
    let o_ids = [];
    ids.forEach((item) => {
      o_ids.push(new Types.ObjectId(item))
    })
    return await this.rolePermissionSchema.deleteMany({ role_id :new Types.ObjectId(role_id),permission_id: {$in: o_ids}});
  }

}
