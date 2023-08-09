import { ApiProperty } from '@nestjs/swagger';
import {  IsString  } from 'class-validator';
export class CreateCompanyEmployeeDto {
    // 标签名称
    @IsString()
    @ApiProperty({ description: '用户ID',example:'用户ID' })
    user_id: string
    // 标签名称
    @IsString()
    @ApiProperty({ description: '公司ID' ,example:'公司ID' })
    company_id: string

}
