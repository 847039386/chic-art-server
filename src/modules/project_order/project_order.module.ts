import { Module } from '@nestjs/common';
import { ProjectOrderService } from './project_order.service';
import { ProjectOrderController } from './project_order.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { ProjectOrderSchema } from './schema/project_order.schema';
import { ProjectOrderEmployeeModule } from '../project_order_employee/project_order_employee.module';

@Module({
  exports: [
    MongooseModule.forFeature([{ name: 'ProjectOrder', schema: ProjectOrderSchema }]),
  ],
  controllers: [ProjectOrderController],
  providers: [ProjectOrderService],
  imports: [
    MongooseModule.forFeature([{ name: 'ProjectOrder', schema: ProjectOrderSchema }]),
    ProjectOrderEmployeeModule
  ]
})
export class ProjectOrderModule {}
