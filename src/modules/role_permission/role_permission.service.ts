import { Injectable } from '@nestjs/common';
import { CreateRolePermissionDto } from './dto/create-role_permission.dto';
import mongoose, { Model, Types } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CreatePermissionDto } from '../permission/dto/create-permission.dto';
import { familyTree, getTreeIds, sonsTree, treeFormat } from 'src/shared/utils/tree.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';

@Injectable()
export class RolePermissionService {

  constructor(
    @InjectModel('RolePermission') private readonly rolePermissionSchema: Model<CreateRolePermissionDto>,
    @InjectModel('Permission') private readonly permissionSchema: Model<CreatePermissionDto>,
    @InjectConnection() private readonly connection: mongoose.Connection
  ) { }

  // 创建一条权限
  async create(dto: CreateRolePermissionDto) {
    let session = await this.connection.startSession(); 
    session.startTransaction();
    let result;
     try {
        // 获取所有的权限列表
        let permission_all = treeFormat(await this.permissionSchema.find({},{}).lean().session(session))
        // 获取角色下所有的权限
        let permissions = await this.rolePermissionSchema.find({ role_id :new Types.ObjectId(dto.role_id)}).session(session)
        // 1、先向上寻找这条权限的父级成员，父级拥有子集权限，所以当添加权限的父级已被添加时，不允许添加
        let family =  familyTree(permission_all,dto.permission_id)
        // 循环该权限的父级成员，第一位1是他自己
        for (let index = 1; index < family.length; index++) {
          // 循环该角色下的所有权限
          for (let jindex = 0; jindex < permissions.length; jindex++) {
              // 当添加的权限的父级已经被添加时，不允许用户添加这条权限
              if(family[index]._id == permissions[jindex].permission_id.toString()){
                throw new BaseException(ResultCode.ROLE_PERMISSION_IS_EXIST_PARENT,{})
              }            
          }
        }
        // 2、向下查询这条权限的子集、当已经添加的权限是新添加权限子集的时候，删除该权限下所有的子集并添加他
        let children = sonsTree(permission_all,dto.permission_id)
        // 上面的代码获取该条权限所有的子集返回object[],而ids是一个数组包括上面数据里所有id值，如['id1','id2']
        let ids = getTreeIds(children)
        if(ids.length > 0){
            let o_ids = [];
            ids.forEach((item) => {
              o_ids.push(new Types.ObjectId(item))
            })
            // 当ids，也就是添加的这条权限有子集的时候，删除他们，虽然ids包含多个可能不存在的值，但是deleteMany会过滤他们
            await this.rolePermissionSchema.deleteMany({ role_id :new Types.ObjectId(dto.role_id),permission_id: {$in: o_ids}}).session(session);
        }
        // 连接角色与权限的关系
        const rolePermission = new this.rolePermissionSchema({role_id :new Types.ObjectId(dto.role_id),permission_id :new Types.ObjectId(dto.permission_id)})
        result = await rolePermission.save({session})
        await session.commitTransaction();
     }catch (error) {
      await session.abortTransaction();
      throw new BaseException(ResultCode.ERROR,{},error)
    }finally{
      await session.endSession();
    }
    return result
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

}
