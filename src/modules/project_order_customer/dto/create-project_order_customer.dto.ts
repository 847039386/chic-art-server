import { ApiProperty } from '@nestjs/swagger';
import {  IsString ,IsInt  } from 'class-validator';

export class CreateProjectOrderCustomerDto {
    @ApiProperty({ description: '订单ID', type: String ,example :'project_order_id' })
    @IsString()
    project_order_id :string
}
