import { Module } from '@nestjs/common';
import { ProjectOrderCameraService } from './project_order_camera.service';
import { ProjectOrderCameraController } from './project_order_camera.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectOrderCameraSchema } from './schema/project_order_camera.schema';

@Module({
  controllers: [ProjectOrderCameraController],
  providers: [ProjectOrderCameraService],
  imports: [
    MongooseModule.forFeature([{ name: 'ProjectOrderCamera', schema: ProjectOrderCameraSchema }]),
  ]
})
export class ProjectOrderCameraModule {}
