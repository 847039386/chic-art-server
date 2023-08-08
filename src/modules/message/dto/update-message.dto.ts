import { ApiProperty } from '@nestjs/swagger';
import {  IsString ,IsInt, IsArray } from 'class-validator';

export class SearchCompanyDto  {
    @ApiProperty({ description: '页数', type: Number ,example :1 })
    @IsInt()
    page ?:number
    @ApiProperty({ description: '每页数量', type: Number ,example :10 })
    @IsInt()
    limit ?:number
    @ApiProperty({ description: 'user_id', type: String ,example :'user_id' })
    @IsInt()
    user_id ?:string

}
