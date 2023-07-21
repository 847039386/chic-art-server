import { ApiProperty } from '@nestjs/swagger';
import {  IsString  } from 'class-validator';

export class UpdateCompanyDto {
    // 公司ID
    @IsString()
    @ApiProperty({ description: '公司ID', type: String ,example:'公司ID' })
    id: string
    // 公司名称
    @IsString()
    @ApiProperty({ description: '公司名称', type: String ,example:'公司名称' })
    name: string
    // 公司描述
    @IsString()
    @ApiProperty({ description: '公司描述', type: String ,example:'公司描述' })
    description: String
}

export class UpdateCompanyWeightDto {
    // 公司ID
    @IsString()
    @ApiProperty({ description: '公司ID', type: String ,example:'公司ID' })
    id: string
    // 公司权重
    @IsString()
    @ApiProperty({ description: '公司权重', type: Number ,example:'公司权重' })
    weight: number
}

export class UpdateCompanyStateDto {
    // 公司ID
    @IsString()
    @ApiProperty({ description: '公司ID', type: String ,example:'公司ID' })
    id: string
    // 公司状态
    @IsString()
    @ApiProperty({ description: '公司状态', type: Number ,example:1 })
    state: number
}
