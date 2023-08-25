
import { ApiProperty } from '@nestjs/swagger';
import {  IsString } from 'class-validator';

export class CreateProjectOrderNoteDto {
    
    @IsString()
    @ApiProperty({ description: '项目订单ID', example:'项目订单ID' })
    project_order_id: string

    @IsString()
    @ApiProperty({ description: '笔记标题', example:'笔记标题' })
    title: string

    @IsString()
    @ApiProperty({ description: '笔记内容', example:'笔记内容' })
    content: string

    @IsString()
    @ApiProperty({ description: '可看状态', example:0 })
    state: number

}

