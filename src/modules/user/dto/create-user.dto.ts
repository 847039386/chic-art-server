import {  IsString ,IsInt} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
    // 用户名称
    @ApiProperty({ description: '用户名称', type: String })
    @IsString()
    name:String
    // 头像url地址
    @IsString()
    @ApiProperty({ description: '用户头像', type: String })
    avatar :String
}

export class SearchUserDto {
    @ApiProperty({ description: '页数', type: Number ,example :1 })
    @IsInt()
    page ?:number
    @ApiProperty({ description: '每页数量', type: Number ,example :10 })
    @IsInt()
    limit ?:number
    @ApiProperty({ description: '用户名称模糊查询', type: String })
    @IsString()
    name ?:string
    @ApiProperty({ description: '用户状态', type: Number })
    @IsString()
    state ?:number
}
