import { ApiProperty } from '@nestjs/swagger';
import {  IsString ,IsInt, IsArray } from 'class-validator';

export class UpdateProjectOrderDto {


}

export class ProjectOrderHandOverDto {

    @ApiProperty({ description: '项目订单id', type: Number ,example :'_id' })
    @IsString()
    id :string
    @ApiProperty({ description: '交接人id', type: Number ,example :'user_id' })
    @IsInt()
    recv_user_id :string
    
}

