import { Module, forwardRef } from '@nestjs/common';
import { ProjectOrderNoteService } from './project_order_note.service';
import { ProjectOrderNoteController } from './project_order_note.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectOrderNoteSchema } from './schema/project_order_note.schema';
import { ProjectOrderModule } from '../project_order/project_order.module';
import { ProjectOrderCustomerModule } from '../project_order_customer/project_order_customer.module';
import { ProjectOrderEmployeeModule } from '../project_order_employee/project_order_employee.module';

@Module({
  exports:[
    MongooseModule.forFeature([{ name: 'ProjectOrderNote', schema: ProjectOrderNoteSchema }]),
  ],
  controllers: [ProjectOrderNoteController],
  providers: [ProjectOrderNoteService],
  imports:[
    MongooseModule.forFeature([{ name: 'ProjectOrderNote', schema: ProjectOrderNoteSchema }]),
    forwardRef(() => ProjectOrderModule),
    ProjectOrderCustomerModule,
    ProjectOrderEmployeeModule
    
  ]
})
export class ProjectOrderNoteModule {}
