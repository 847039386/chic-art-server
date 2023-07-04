import { ApiProperty } from '@nestjs/swagger';
import {  IsString } from 'class-validator';
export class RefreshTokenDto {
    // 用户昵称 
    @ApiProperty({ description: '刷新token', type: String  ,example:'refreshToken'})
    @IsString()
    refreshToken :string
}
