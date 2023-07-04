import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserSchema } from './schema/user.schema';

@Module({
  exports:[UserService],
  controllers: [UserController],
  providers: [UserService],
  imports:[
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
})

export class UserModule {}
 