
import { ApiProperty } from '@nestjs/swagger';
import {  IsString } from 'class-validator';

export class CreateProjectOrderCameraDto {

    @IsString()
    @ApiProperty({ description: '监控ID', example:'监控ID' })
    camera_id: string

    @IsString()
    @ApiProperty({ description: '项目订单ID', example:'项目订单ID' })
    project_order_id: string
}
