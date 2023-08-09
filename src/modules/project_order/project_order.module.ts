import { Module } from '@nestjs/common';
import { ProjectOrderService } from './project_order.service';
import { ProjectOrderController } from './project_order.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { ProjectOrderSchema } from './schema/project_order.schema';

@Module({
  exports: [
    MongooseModule.forFeature([{ name: 'ProjectOrder', schema: ProjectOrderSchema }]),
  ],
  controllers: [ProjectOrderController],
  providers: [ProjectOrderService],
  imports: [
    MongooseModule.forFeature([{ name: 'ProjectOrder', schema: ProjectOrderSchema }]),
  ]
})
export class ProjectOrderModule {}
