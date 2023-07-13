import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSchema } from './schema/role.schema';
import { RolePermissionModule } from '../role_permission/role_permission.module';
import { UserGroupRoleModule } from '../user_group_role/user_group_role.module';

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  imports: [
    MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }]),
    RolePermissionModule,
    UserGroupRoleModule
  ]
})
export class RoleModule {}

