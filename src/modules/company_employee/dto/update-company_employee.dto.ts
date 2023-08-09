import { ApiProperty } from '@nestjs/swagger';
import {  IsString  } from 'class-validator';

export class UpdateCompanyEmployeeDto {

}

export class UpdateCompanyEmployeeGroupNameDto{
    @IsString()
    @ApiProperty({ description: '公司员工关系表ID',example:'用户员工关系表ID' })
    id: string
    @IsString()
    @ApiProperty({ description: '公司员工分组' ,example:'我的工人' })
    group_name: string
}

export class UpdateCallCompanyEmployeeGroupNameDto{
    @IsString()
    @ApiProperty({ description: '公司ID',example:'用户员工关系表ID' })
    company_id: string
    @IsString()
    @ApiProperty({ description: '公司员工分组' ,example:'我的工人' })
    group_name: string
}
