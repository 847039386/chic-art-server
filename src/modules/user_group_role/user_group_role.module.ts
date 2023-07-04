import { Module } from '@nestjs/common';
import { UserGroupRoleService } from './user_group_role.service';
import { UserGroupRoleController } from './user_group_role.controller';

@Module({
  controllers: [UserGroupRoleController],
  providers: [UserGroupRoleService]
})
export class UserGroupRoleModule {}
