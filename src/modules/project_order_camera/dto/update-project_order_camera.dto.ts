import { ApiProperty } from '@nestjs/swagger';
import {  IsString } from 'class-validator';

export class UpdateProjectOrderCameraDto {

}

export class UpdateProjectOrderCameraNameDto {
    @IsString()
    @ApiProperty({ description: '项目监控ID', example:'项目监控ID' })
    id: string

    @IsString()
    @ApiProperty({ description: '项目摄像头别名', example:'项目摄像头别名' })
    name: string
}

export class UpdateProjectOrderCameraStateDto {
    @IsString()
    @ApiProperty({ description: '项目监控ID', example:'项目监控ID' })
    id: string
    @IsString()
    @ApiProperty({ description: '摄像头开放状态', example:'摄像头开放状态' })
    state: string
}
