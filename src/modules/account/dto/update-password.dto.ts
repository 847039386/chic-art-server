import {  IsString ,IsInt ,IsDate ,IsObject} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose'
export class UpdatePasswordDto {
    @ApiProperty({ description: '账号', type: String ,example:'admin1' })
    @IsString()
    identifier :string
    @ApiProperty({ description: '旧密码', type: String ,example:'admin1' })
    @IsString()
    o_credential :string
    @ApiProperty({ description: '新密码', type: String ,example:'admin1' })
    @IsString()
    credential :string
    @ApiProperty({ description: '新密码确认', type: String ,example:'admin1' })
    @IsString()
    r_credential :string
}
