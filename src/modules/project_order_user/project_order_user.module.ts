import { Module } from '@nestjs/common';
import { ProjectOrderUserService } from './project_order_user.service';
import { ProjectOrderUserController } from './project_order_user.controller';
import { ProjectOrderUserSchema } from './schema/project_order_user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectOrderModule } from '../project_order/project_order.module';
import { MessageModule } from '../message/message.module';
import { CompanyEmployeeModule } from '../company_employee/company_employee.module';

@Module({
  controllers: [ProjectOrderUserController],
  providers: [ProjectOrderUserService],
  imports: [
    MongooseModule.forFeature([{ name: 'ProjectOrderUser', schema: ProjectOrderUserSchema }]),
    ProjectOrderModule,
    CompanyEmployeeModule,
    MessageModule,

  ]
})
export class ProjectOrderUserModule {}
