import { Module ,forwardRef } from '@nestjs/common';
import { UserGroupService } from './user_group.service';
import { UserGroupController } from './user_group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserGroupSchema } from './schema/user_group.schema';
import { UserGroupRoleModule } from '../user_group_role/user_group_role.module';

@Module({
  exports:[UserGroupService],
  controllers: [UserGroupController],
  providers: [UserGroupService],
  imports: [
    MongooseModule.forFeature([{ name: 'UserGroup', schema: UserGroupSchema }]),
    forwardRef(() => UserGroupRoleModule)
  ]
})
export class UserGroupModule {}
