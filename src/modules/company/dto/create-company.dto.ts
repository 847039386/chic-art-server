import { ApiProperty } from '@nestjs/swagger';
import {  IsString ,IsInt } from 'class-validator';

export class CreateCompanyDto {
    @IsString()
    @ApiProperty({ description: '公司创始人', type: String ,example:'user_id' })
    user_id :string
    // 公司名称
    @IsString()
    @ApiProperty({ description: '公司名称', type: String ,example:'公司名称' })
    name: string
    // 公司描述
    @IsString()
    @ApiProperty({ description: '公司描述', type: String ,example:'公司描述' })
    description: String
}


export class SearchCompanyDto {
    @ApiProperty({ description: '页数', type: Number ,example :1 })
    @IsInt()
    page ?:number
    @ApiProperty({ description: '每页数量', type: Number ,example :10 })
    @IsInt()
    limit ?:number
    @ApiProperty({ description: '公司名称模糊查询', type: String })
    @IsString()
    name ?:string
    @ApiProperty({ description: '公司状态', type: Number })
    @IsString()
    state ?:number
    @ApiProperty({ description: '审核状态', type: Number })
    @IsString()
    censor ?:number
}