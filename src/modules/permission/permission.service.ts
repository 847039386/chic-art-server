import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { sonsTree ,treeFormat ,handleTree ,familyTree ,getTreeIds } from 'src/shared/utils/tree.util'
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {

  constructor(@InjectModel('Permission') private readonly requestLogSchema: Model<CreatePermissionDto>) { }

  async create(createPermissionDto: CreatePermissionDto) {
    const permission = new this.requestLogSchema(createPermissionDto)
    return await permission.save();
  }


  async findAll() {
    return await this.requestLogSchema.find({},{}).lean()
  }

  // 此方法接受一个id数组
  async updateAvailable(ids: string [],available :boolean) {
    return await this.requestLogSchema.updateMany({_id: {$in: ids}},{ available })
  }

  // 该方法传入权限id 将会删除他下面所有的子集，这其中包括他自己
  async remove(id: string) {
    let result = await this.requestLogSchema.find({},{}).lean()
    let children = sonsTree(treeFormat(result),id)
    let ids = getTreeIds(children).concat(id)
    return await this.requestLogSchema.deleteMany({_id: {$in: ids}});
  }

  async updateInfo(dto :UpdatePermissionDto) {
    return await this.requestLogSchema.findByIdAndUpdate(dto.id,{
      name :dto.name,
      description :dto.description,
      code :dto.code,
      type :dto.type,
    })
  }

}


