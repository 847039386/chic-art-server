import { Module } from '@nestjs/common';
import { ProjectOrderEmployeeService } from './project_order_employee.service';
import { ProjectOrderEmployeeController } from './project_order_employee.controller';
import { ProjectOrderEmployeeSchema } from './schema/project_order_employee.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  exports:[
    MongooseModule.forFeature([{ name: 'ProjectOrderEmployee', schema: ProjectOrderEmployeeSchema }]),
  ],
  controllers: [ProjectOrderEmployeeController],
  providers: [ProjectOrderEmployeeService],
  imports: [
    MongooseModule.forFeature([{ name: 'ProjectOrderEmployee', schema: ProjectOrderEmployeeSchema }]),
  ]
})
export class ProjectOrderEmployeeModule {}
