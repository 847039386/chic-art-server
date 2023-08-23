
import { ApiProperty } from '@nestjs/swagger';
import {  IsString  } from 'class-validator';


export class CreateProjectOrderEmployeeDto {
    @ApiProperty({ description: '员工的userID', type: String ,example :'user_id' })
    @IsString()
    user_id :string
    @ApiProperty({ description: '公司员工ID', type: String ,example :'company_employee_id' })
    @IsString()
    company_employee_id :string
    @ApiProperty({ description: '订单ID', type: String ,example :'project_order_id' })
    @IsString()
    project_order_id :string
}
