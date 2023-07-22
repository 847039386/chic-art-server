import { ApiProperty } from '@nestjs/swagger';
import {  IsString ,IsInt, IsArray } from 'class-validator';

export class CreateCameraDto {
    @IsString()
    @ApiProperty({ description: '摄像头名称', type: String ,example:'name' })
    name :string
    // 标签数组
    @IsArray()
    @ApiProperty({ description: '卡号', type: String ,example:'iccid' })
    iccid :string
    // 公司描述
    @IsString()
    @ApiProperty({ description: '拉流地址', type: String ,example:'url' })
    url: String
}

export class SearchCameraDto {
    @ApiProperty({ description: '页数', type: Number ,example :1 })
    @IsInt()
    page ?:number
    @ApiProperty({ description: '每页数量', type: Number ,example :10 })
    @IsInt()
    limit ?:number
    @ApiProperty({ description: '摄像头名称', type: String })
    @IsString()
    name ?:string
    @ApiProperty({ description: '摄像头状态', type: Number })
    @IsString()
    state ?:number
    @ApiProperty({ description: '摄像头编号', type: Number })
    @IsString()
    no ?:number
    @ApiProperty({ description: '摄像头ICCID', type: Number })
    @IsString()
    iccid ?:number
}
