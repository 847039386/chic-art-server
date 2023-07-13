import { Module ,forwardRef} from '@nestjs/common';
import { UserGroupRoleService } from './user_group_role.service';
import { UserGroupRoleController } from './user_group_role.controller';
import { UserGroupRoleSchema } from './schema/user_group_role.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserGroupModule } from '../user_group/user_group.module';

@Module({
  exports:[
    UserGroupRoleService,
    MongooseModule.forFeature([{ name: 'UserGroupRole', schema: UserGroupRoleSchema }]),
  ],
  controllers: [UserGroupRoleController],
  providers: [UserGroupRoleService],
  imports: [
    MongooseModule.forFeature([{ name: 'UserGroupRole', schema: UserGroupRoleSchema }]),
    forwardRef(() => UserGroupModule)
  ]
})

export class UserGroupRoleModule {}
