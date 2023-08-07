import {  IsString ,IsObject ,MinLength} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose'
export class CreateAccountDto {
    @IsObject()
    user_id:Types.ObjectId
    @IsString()
    salt :string
    @IsString()
    identity_type :string
    @IsString()
    identifier :string
    @IsString()
    credential :string
}

export class RegisterDto {
    // 用户昵称 
    @ApiProperty({ description: '用户昵称', type: String  ,example:'秋天的小鲨鱼'})
    @IsString()
    @MinLength(10)
    nickname :string
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

export class WxloginDto {
    // 用户昵称 
    @ApiProperty({ description: '用户微信昵称', type: String  ,example:'秋天的小鲨鱼'})
    @IsString()
    @MinLength(10)
    nickname :string
    // 头像地址 
    @ApiProperty({ description: '用户微信头像地址', type: String  ,example:'http://192.168.3.9:3000/images/avatar/1.jpg'})
    @IsString()
    avatar :string
    // 密码
    @ApiProperty({ description: '根据code查找openid', type: String  ,example:'code'})
    @IsString()
    code :string
   
}
