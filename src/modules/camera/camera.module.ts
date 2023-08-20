import { Module } from '@nestjs/common';
import { CameraService } from './camera.service';
import { CameraController } from './camera.controller';
import { CameraSchema } from './schema/camera.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CounterModule } from '../counter/counter.module';

@Module({
  exports:[
    MongooseModule.forFeature([{ name: 'Camera', schema: CameraSchema }]),
  ],
  controllers: [CameraController],
  providers: [CameraService],
  imports: [
    MongooseModule.forFeature([{ name: 'Camera', schema: CameraSchema }]),
    CounterModule
  ]
})
export class CameraModule {}
