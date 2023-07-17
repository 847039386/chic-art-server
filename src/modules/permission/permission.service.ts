import mongoose ,{ Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel ,InjectConnection } from '@nestjs/mongoose';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { sonsTree ,treeFormat ,handleTree ,familyTree ,getTreeIds } from 'src/shared/utils/tree.util'
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { CreateRolePermissionDto } from '../role_permission/dto/create-role_permission.dto';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';

@Injectable()
export class PermissionService {

  constructor(
    @InjectModel('Permission') private readonly permissionSchema: Model<CreatePermissionDto>,
    @InjectModel('RolePermission') private readonly rolePermissionSchema: Model<CreateRolePermissionDto>,
    @InjectConnection() private readonly connection: mongoose.Connection
    ) { }

  async create(createPermissionDto: CreatePermissionDto) {
    const permission = new this.permissionSchema(createPermissionDto)
    return await permission.save();
  }


  async findAll() {
    return await this.permissionSchema.find({},{}).lean()
  }

  // 此方法接受一个id数组
  async updateAvailable(ids: string [],available :boolean) {
    return await this.permissionSchema.updateMany({_id: {$in: ids}},{ available })
  }

  // 该方法传入权限id 将会删除他下面所有的子集，这其中包括他自己
  async remove(id: string) {

    let session = await this.connection.startSession(); 
    session.startTransaction();
    let result;
    try {
      // 查询所有权限
      let permissions = await this.permissionSchema.find({},{}).lean()
      // 根据ID查询该权限下的所有子权限
      let children = sonsTree(treeFormat(permissions),id)
      // 返回一个只有id的数组，在加上要删除的ID
      let ids = getTreeIds(children).concat(id)
      // 删除该组和该组的子集
      result = await this.permissionSchema.deleteMany({_id: {$in: ids}}).session(session)
      // 循环改成将ids改成ObjectId
      let o_ids = [];
      ids.forEach((item) => {
        o_ids.push(new Types.ObjectId(item))
      })
      // 删除角色权限表中的关联，包括组和组的子集
      await this.rolePermissionSchema.deleteMany({ permission_id : {$in: o_ids } }).session(session)
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BaseException(ResultCode.ERROR,{},error)
    }finally{
      await session.endSession();
    }
    return result;


  }

  async updateInfo(dto :UpdatePermissionDto) {
    return await this.permissionSchema.findByIdAndUpdate(dto.id,{
      name :dto.name,
      description :dto.description,
      code :dto.code,
      type :dto.type,
    })
  }

}


