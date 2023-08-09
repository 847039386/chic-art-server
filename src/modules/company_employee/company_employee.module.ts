import { Module } from '@nestjs/common';
import { CompanyEmployeeService } from './company_employee.service';
import { CompanyEmployeeController } from './company_employee.controller';
import { CompanyEmployeeSchema } from './schema/company_employee.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  exports:[
    MongooseModule.forFeature([{ name: 'CompanyEmployee', schema: CompanyEmployeeSchema  }]),
  ],
  controllers: [CompanyEmployeeController],
  providers: [CompanyEmployeeService],
  imports: [
    MongooseModule.forFeature([{ name: 'CompanyEmployee', schema: CompanyEmployeeSchema }]),
  ]
})
export class CompanyEmployeeModule {}
