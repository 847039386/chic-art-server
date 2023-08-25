import { Module, forwardRef } from '@nestjs/common';
import { ProjectOrderService } from './project_order.service';
import { ProjectOrderController } from './project_order.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { ProjectOrderSchema } from './schema/project_order.schema';
import { ProjectOrderEmployeeModule } from '../project_order_employee/project_order_employee.module';
import { CompanyEmployeeModule } from '../company_employee/company_employee.module';
import { CompanyModule } from '../company/company.module';
import { ProjectOrderCameraModule } from '../project_order_camera/project_order_camera.module';
import { ProjectOrderCustomerModule } from '../project_order_customer/project_order_customer.module';
import { CompanyCameraModule } from '../company_camera/company_camera.module';
import { ProjectOrderNoteModule } from '../project_order_note/project_order_note.module';

@Module({
  exports: [
    MongooseModule.forFeature([{ name: 'ProjectOrder', schema: ProjectOrderSchema }]),
    ProjectOrderService
  ],
  controllers: [ProjectOrderController],
  providers: [ProjectOrderService],
  imports: [
    MongooseModule.forFeature([{ name: 'ProjectOrder', schema: ProjectOrderSchema }]),
    forwardRef(() => ProjectOrderCustomerModule),
    forwardRef(() => ProjectOrderCameraModule),
    forwardRef(() => ProjectOrderNoteModule),
    forwardRef(() => ProjectOrderEmployeeModule),
    CompanyEmployeeModule,
    CompanyCameraModule,
    CompanyModule,
  ]
})
export class ProjectOrderModule {}
