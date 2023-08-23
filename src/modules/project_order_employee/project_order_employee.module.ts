import { Module, forwardRef } from '@nestjs/common';
import { ProjectOrderEmployeeService } from './project_order_employee.service';
import { ProjectOrderEmployeeController } from './project_order_employee.controller';
import { ProjectOrderEmployeeSchema } from './schema/project_order_employee.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectOrderModule } from '../project_order/project_order.module';
import { CompanyModule } from '../company/company.module';
import { CompanyEmployeeModule } from '../company_employee/company_employee.module';

@Module({
  exports:[
    MongooseModule.forFeature([{ name: 'ProjectOrderEmployee', schema: ProjectOrderEmployeeSchema }]),
  ],
  controllers: [ProjectOrderEmployeeController],
  providers: [ProjectOrderEmployeeService],
  imports: [
    MongooseModule.forFeature([{ name: 'ProjectOrderEmployee', schema: ProjectOrderEmployeeSchema }]),
    forwardRef(() => ProjectOrderModule),
    CompanyEmployeeModule,
    CompanyModule,
  ]
})
export class ProjectOrderEmployeeModule {}
