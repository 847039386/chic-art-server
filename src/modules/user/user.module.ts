import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserSchema } from './schema/user.schema';
import { UserGroupUserModule } from '../user_group_user/user_group_user.module';
import { UserGroupModule } from '../user_group/user_group.module';
import { UserGroupRoleModule } from '../user_group_role/user_group_role.module';

@Module({
  exports:[UserService],
  controllers: [UserController],
  providers: [UserService],
  imports:[
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    UserGroupUserModule,
    UserGroupModule,
    UserGroupRoleModule
  ],
})

export class UserModule {}
 