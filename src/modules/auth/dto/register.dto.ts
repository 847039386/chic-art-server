import { ApiProperty } from '@nestjs/swagger';
import {  IsString ,MaxLength, MinLength} from 'class-validator';
export class RegisterDto {
    // 用户昵称 
    @ApiProperty({ description: '用户昵称', type: String  ,example:'秋天的小鲨鱼'})
    @IsString()
    @MinLength(10)
    name :string
    // 头像地址 
    @ApiProperty({ description: '头像地址', type: String  ,example:'http://192.168.3.9:3000/images/avatar/1.jpg'})
    @IsString()
    avatar :string
    // 用户名
    @ApiProperty({ description: '账号', type: String ,example:'admin1' })
    @IsString()
    identifier : string
    // 密码
    @ApiProperty({ description: '密码', type: String  ,example:'admin1'})
    @IsString()
    credential :string
    // 密码
    @ApiProperty({ description: '确认密码', type: String  ,example:'admin1'})
    @IsString()
    r_credential :string
   
}
