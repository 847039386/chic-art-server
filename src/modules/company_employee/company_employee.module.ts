import { Module, forwardRef } from '@nestjs/common';
import { CompanyEmployeeService } from './company_employee.service';
import { CompanyEmployeeController } from './company_employee.controller';
import { CompanyEmployeeSchema } from './schema/company_employee.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyModule } from '../company/company.module';

@Module({
  exports:[
    MongooseModule.forFeature([{ name: 'CompanyEmployee', schema: CompanyEmployeeSchema  }]),
  ],
  controllers: [CompanyEmployeeController],
  providers: [CompanyEmployeeService],
  imports: [
    MongooseModule.forFeature([{ name: 'CompanyEmployee', schema: CompanyEmployeeSchema }]),
    forwardRef(() => CompanyModule),
  ]
})
export class CompanyEmployeeModule {}
