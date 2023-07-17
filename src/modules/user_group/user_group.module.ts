import { Module ,forwardRef } from '@nestjs/common';
import { UserGroupService } from './user_group.service';
import { UserGroupController } from './user_group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserGroupSchema } from './schema/user_group.schema';
import { UserGroupRoleModule } from '../user_group_role/user_group_role.module';
import { UserGroupUserModule } from '../user_group_user/user_group_user.module';

@Module({
  exports:[
    UserGroupService,
    MongooseModule.forFeature([{ name: 'UserGroup', schema: UserGroupSchema }]),
  ],
  controllers: [UserGroupController],
  providers: [UserGroupService],
  imports: [
    MongooseModule.forFeature([{ name: 'UserGroup', schema: UserGroupSchema }]),
    forwardRef(() => UserGroupRoleModule),
    forwardRef(() => UserGroupUserModule)
  ]
})
export class UserGroupModule {}
