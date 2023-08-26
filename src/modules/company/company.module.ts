import { Module, forwardRef } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanySchema } from './schema/company.schema';
import { CompanyEmployeeModule } from '../company_employee/company_employee.module';

@Module({
  exports:[
    MongooseModule.forFeature([{ name: 'Company', schema: CompanySchema }]),
    CompanyService
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  imports: [
    MongooseModule.forFeature([{ name: 'Company', schema: CompanySchema }]),
    forwardRef(() => CompanyEmployeeModule),
  ]
})

export class CompanyModule {}
