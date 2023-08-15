import { Module } from '@nestjs/common';
import { ProjectOrderCustomerService } from './project_order_customer.service';
import { ProjectOrderCustomerController } from './project_order_customer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectOrderCustomerSchema } from './schema/project_order_customer.schema';

@Module({
  controllers: [ProjectOrderCustomerController],
  providers: [ProjectOrderCustomerService],
  imports: [
    MongooseModule.forFeature([{ name: 'ProjectOrderCustomer', schema: ProjectOrderCustomerSchema }]),
  ]
})
export class ProjectOrderCustomerModule {}
