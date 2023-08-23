import { Module, forwardRef } from '@nestjs/common';
import { ProjectOrderCameraService } from './project_order_camera.service';
import { ProjectOrderCameraController } from './project_order_camera.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectOrderCameraSchema } from './schema/project_order_camera.schema';
import { CompanyCameraModule } from '../company_camera/company_camera.module';
import { ProjectOrderModule } from '../project_order/project_order.module';

@Module({
  exports:[
    MongooseModule.forFeature([{ name: 'ProjectOrderCamera', schema: ProjectOrderCameraSchema }]),
  ],
  controllers: [ProjectOrderCameraController],
  providers: [ProjectOrderCameraService],
  imports: [
    MongooseModule.forFeature([{ name: 'ProjectOrderCamera', schema: ProjectOrderCameraSchema }]),
    forwardRef(() => ProjectOrderModule),
    CompanyCameraModule,
  ]
})
export class ProjectOrderCameraModule {}
