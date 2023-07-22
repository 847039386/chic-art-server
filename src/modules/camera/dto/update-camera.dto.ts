import { ApiProperty } from '@nestjs/swagger';
import {  IsString ,IsInt, IsArray } from 'class-validator';

export class UpdateCameraDto {
    @IsString()
    @ApiProperty({ description: '摄像头id', type: String ,example:'_id' })
    id :string
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
    url: string
}


export class AssignCameraToCompanyDto {
    // 标签数组
    @IsArray()
    @ApiProperty({ description: '摄像头id', type: String ,example:'id' })
    id :string
    // 公司描述
    @IsString()
    @ApiProperty({ description: '公司id', type: String ,example:'id' })
    company_id? : string
}
