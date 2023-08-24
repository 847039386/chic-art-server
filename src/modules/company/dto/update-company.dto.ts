import { ApiProperty } from '@nestjs/swagger';
import {  IsString ,IsArray } from 'class-validator';

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

export class UpdateCompanyLogoDto {
    // 公司ID
    @IsString()
    @ApiProperty({ description: '公司ID', type: String ,example:'公司ID' })
    id: string
    // 公司状态
    @IsString()
    @ApiProperty({ description: '图片地址', type: Number ,example:'logo_url' })
    logo: string
}

export class UpdateCompanyNameDto {
    // 公司ID
    @IsString()
    @ApiProperty({ description: '公司ID', type: String ,example:'公司ID' })
    id: string
    // 公司状态
    @IsString()
    @ApiProperty({ description: '公司名称', type: Number ,example:'公司名称' })
    name: string
}

export class UpdateCompanyDescriptionDto {
    // 公司ID
    @IsString()
    @ApiProperty({ description: '公司ID', type: String ,example:'公司ID' })
    id: string
    // 公司状态
    @IsString()
    @ApiProperty({ description: '公司简介', type: Number ,example:'公司简介' })
    description: string
}

export class UpdateCompanyTagDto {
    // 公司ID
    @IsString()
    @ApiProperty({ description: '公司ID', type: String ,example:'公司ID' })
    id: string
    // 标签数组
    @IsArray()
    @ApiProperty({ description: '标签数组', type: String ,example:'tag_id数组' })
    tag_ids :[string]
}

export class UpdateCompanyAddressDto {
    // 公司ID
    @IsString()
    @ApiProperty({ description: '公司ID', type: String ,example:'公司ID' })
    id: string
    // 标签数组
    @IsArray()
    @ApiProperty({ description: '公司地址', type: String ,example:'公司地址' })
    address :string
}

