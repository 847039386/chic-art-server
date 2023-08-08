import { Module } from '@nestjs/common';
import { ProjectOrderUserService } from './project_order_user.service';
import { ProjectOrderUserController } from './project_order_user.controller';
import { ProjectOrderUserSchema } from './schema/project_order_user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [ProjectOrderUserController],
  providers: [ProjectOrderUserService],
  imports: [
    MongooseModule.forFeature([{ name: 'ProjectOrderUser', schema: ProjectOrderUserSchema }]),
  ]
})
export class ProjectOrderUserModule {}
