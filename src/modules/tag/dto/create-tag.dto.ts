import { ApiProperty } from '@nestjs/swagger';
import {  IsString  } from 'class-validator';

export class CreateTagDto {
    // 标签名称
    @IsString()
    @ApiProperty({ description: '标签名称', type: String ,example:'标签名称' })
    name: string
}
