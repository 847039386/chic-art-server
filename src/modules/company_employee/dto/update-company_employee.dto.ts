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

export class UpdateCompanyEmployeeIdentityTypeDto{
    @IsString()
    @ApiProperty({ description: '公司员工关系表ID',example:'用户员工关系表ID' })
    id: string
    @IsString()
    @ApiProperty({ description: '身份类型' ,example:0 })
    identity_type: number
}

export class UpdateCompanyEmployeeRemarkDto{
    @IsString()
    @ApiProperty({ description: '公司员工关系表ID',example:'用户员工关系表ID' })
    id: string
    @IsString()
    @ApiProperty({ description: '备注' ,example:'油漆工' })
    remark: string
}
