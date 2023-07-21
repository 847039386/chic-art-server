import { ApiProperty } from '@nestjs/swagger';
import {  IsString  } from 'class-validator';

export class UpdateTagDto {
    // 标签ID
    @IsString()
    @ApiProperty({ description: '标签ID', type: String ,example:'标签ID' })
    id: string
    // 权限名称
    @IsString()
    @ApiProperty({ description: '标签名称', type: String ,example:'标签名称' })
    name: string
}
