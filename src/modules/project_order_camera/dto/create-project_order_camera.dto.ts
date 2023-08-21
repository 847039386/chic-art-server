
import { ApiProperty } from '@nestjs/swagger';
import {  IsString } from 'class-validator';

export class CreateProjectOrderCameraDto {

    @IsString()
    @ApiProperty({ description: '公司监控关系ID', example:'公司监控关系ID' })
    company_camera_id: string

    @IsString()
    @ApiProperty({ description: '项目订单ID', example:'项目订单ID' })
    project_order_id: string
}
