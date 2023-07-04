import { ApiProperty } from '@nestjs/swagger';
import {  IsString ,IsInt ,IsDate ,IsObject} from 'class-validator';
export class LoginDto {
    // 用户名
    @ApiProperty({ description: '账号', type: String ,example:'admin1' })
    @IsString()
    username : string
    // 请求方法 PUT DELETE GET POST
    @ApiProperty({ description: '密码', type: String  ,example:'admin1'})
    @IsString()
    password :string
    // 错误信息
}
