import { PartialType } from '@nestjs/swagger';
import { CreateCompanyEmployeeDto } from './create-company_employee.dto';

export class UpdateCompanyEmployeeDto extends PartialType(CreateCompanyEmployeeDto) {}
