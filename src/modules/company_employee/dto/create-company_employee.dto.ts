import { ApiProperty } from '@nestjs/swagger';
import {  IsString  } from 'class-validator';
export class CreateCompanyEmployeeDto {
    // 标签名称
    @IsString()
    @ApiProperty({ description: '进度模板名称',example:'工程模板' })
    user_id: string
    // 标签名称
    @IsString()
    @ApiProperty({ description: '进度模板是数组' ,example:['开始','中间','结束'] })
    company_id: [string]
}
