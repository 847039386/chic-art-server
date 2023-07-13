import { Module } from '@nestjs/common';
import { RolePermissionService } from './role_permission.service';
import { RolePermissionController } from './role_permission.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RolePermissionSchema } from './schema/role_permission.schema';
import { PermissionModule } from '../permission/permission.module';
@Module({
  exports :[
    MongooseModule.forFeature([{ name: 'RolePermission', schema: RolePermissionSchema }]),
  ],
  controllers: [RolePermissionController],
  providers: [RolePermissionService],
  imports: [
    MongooseModule.forFeature([{ name: 'RolePermission', schema: RolePermissionSchema }]),
    PermissionModule
  ]
})
export class RolePermissionModule {}
