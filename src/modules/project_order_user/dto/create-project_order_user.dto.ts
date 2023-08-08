import { ApiProperty } from '@nestjs/swagger';
import {  IsString  } from 'class-validator';

export class CreateProjectOrderUserDto {
    @IsString()
    @ApiProperty({ description: '项目订单ID', example:'project_order_id' })
    project_order_id: string
    @IsString()
    @ApiProperty({ description: '员工数组', example:['userID_1','userID_2','userID_3'] })
    user_ids: [string]
}

export class CreateProjectOrderClientDto {
    @IsString()
    @ApiProperty({ description: '项目订单ID', example:'project_order_id' })
    project_order_id: string
    @IsString()
    @ApiProperty({ description: '客户ID', example:'user_id' })
    user_id: string
}
