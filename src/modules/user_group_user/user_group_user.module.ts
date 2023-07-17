import { Module ,forwardRef} from '@nestjs/common';
import { UserGroupUserService } from './user_group_user.service';
import { UserGroupUserController } from './user_group_user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserGroupUserSchema } from './schema/user_group_user.schema';
import { UserGroupModule } from '../user_group/user_group.module';

@Module({
  exports:[
    MongooseModule.forFeature([{ name: 'UserGroupUser', schema: UserGroupUserSchema }]),
  ],
  controllers: [UserGroupUserController],
  providers: [UserGroupUserService],
  imports: [
    MongooseModule.forFeature([{ name: 'UserGroupUser', schema: UserGroupUserSchema }]),
    forwardRef(() => UserGroupModule) 
  ]
})
export class UserGroupUserModule {}

