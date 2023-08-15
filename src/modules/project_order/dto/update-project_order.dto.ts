import { ApiProperty } from '@nestjs/swagger';
import {  IsString ,IsInt, IsArray } from 'class-validator';

export class UpdateProjectOrderDto {


}

export class UpdateProjectOrderStepDto {
    @ApiProperty({ description: '订单ID', type: String })
    @IsString()
    id :string
    @ApiProperty({ description: '步进值', type: String })
    @IsInt()
    step :number
    @ApiProperty({ description: '步近器到了这个total会自动完成订单', type: String })
    @IsInt()
    total :number
}
