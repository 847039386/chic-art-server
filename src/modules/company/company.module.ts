import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanySchema } from './schema/company.schema';

@Module({
  exports:[
    MongooseModule.forFeature([{ name: 'Company', schema: CompanySchema }])
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  imports: [
    MongooseModule.forFeature([{ name: 'Company', schema: CompanySchema }]),
  ]
})

export class CompanyModule {}
