import { Module } from '@nestjs/common';
import { UserGroupUserService } from './user_group_user.service';
import { UserGroupUserController } from './user_group_user.controller';

@Module({
  controllers: [UserGroupUserController],
  providers: [UserGroupUserService]
})
export class UserGroupUserModule {}
