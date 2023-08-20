import { ApiProperty } from '@nestjs/swagger';
import {  IsString ,IsInt, IsArray } from 'class-validator';

export class CreateCompanyCameraDto {}

export class AssignCameraToCompanyDto {
    // 标签数组
    @IsArray()
    @ApiProperty({ description: '摄像头id', type: String ,example:'id' })
    camera_id :string
    // 公司描述
    @IsString()
    @ApiProperty({ description: '公司id', type: String ,example:'id' })
    company_id? : string
}
