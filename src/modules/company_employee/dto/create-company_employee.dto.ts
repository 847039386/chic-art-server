import { ApiProperty } from '@nestjs/swagger';
import {  IsString  } from 'class-validator';
export class CreateCompanyEmployeeDto {
    @IsString()
    @ApiProperty({ description: '公司ID' ,example:'公司ID' })
    company_id: string
}
