import { Module, forwardRef } from '@nestjs/common';
import { ProjectOrderCustomerService } from './project_order_customer.service';
import { ProjectOrderCustomerController } from './project_order_customer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectOrderCustomerSchema } from './schema/project_order_customer.schema';
import { ProjectOrderModule } from '../project_order/project_order.module';
import { UserModule } from '../user/user.module';
import { MessageModule } from '../message/message.module';

@Module({
  exports:[
    MongooseModule.forFeature([{ name: 'ProjectOrderCustomer', schema: ProjectOrderCustomerSchema }]),
  ],
  controllers: [ProjectOrderCustomerController],
  providers: [ProjectOrderCustomerService],
  imports: [
    MongooseModule.forFeature([{ name: 'ProjectOrderCustomer', schema: ProjectOrderCustomerSchema }]),
    forwardRef(() => ProjectOrderModule),
    MessageModule,
    UserModule
  ]
})
export class ProjectOrderCustomerModule {}
