import { Module } from '@nestjs/common';
import { CompanyCameraService } from './company_camera.service';
import { CompanyCameraController } from './company_camera.controller';
import { CompanyCameraSchema } from './schema/company_camera.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CameraModule } from '../camera/camera.module';

@Module({
  exports:[
    MongooseModule.forFeature([{ name: 'CompanyCamera', schema: CompanyCameraSchema }]),
  ],
  controllers: [CompanyCameraController],
  providers: [CompanyCameraService],
  imports: [
    MongooseModule.forFeature([{ name: 'CompanyCamera', schema: CompanyCameraSchema }]),
    CameraModule
  ]
})
export class CompanyCameraModule {}
