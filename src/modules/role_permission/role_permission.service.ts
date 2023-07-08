import { Injectable } from '@nestjs/common';
import { CreateRolePermissionDto } from './dto/create-role_permission.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RolePermissionService {

  constructor(@InjectModel('RolePermission') private readonly rolePermissionSchema: Model<CreateRolePermissionDto>) { }

  async create(createRolePermissionDto: CreateRolePermissionDto) {
    const rolePermission = new this.rolePermissionSchema(createRolePermissionDto)
    return await rolePermission.save()
  }

  async remove(id: string) {
    return await this.rolePermissionSchema.findByIdAndRemove(id);
  }
}
