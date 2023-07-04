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
