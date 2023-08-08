import { ApiProperty } from '@nestjs/swagger';
import {  IsString ,IsInt, IsArray } from 'class-validator';

export class CreateMessageDto {}

// 系统消息
export class CreateSystemMessageDto {

    @IsString()
    @ApiProperty({ description: '消息标题', example:'消息标题' })
    title: string

    @IsString()
    @ApiProperty({ description: '消息内容', example:'消息内容' })
    content: string

    @IsString()
    @ApiProperty({ description: '接收人ID', example:'接收人ID' })
    recv_user_id: string

}

// 给管理员留言
export class CreateMailMessageDto {

    @IsString()
    @ApiProperty({ description: '消息标题', example:'消息标题' })
    title: string

    @IsString()
    @ApiProperty({ description: '消息内容', example:'消息内容' })
    content: string

    @IsString()
    @ApiProperty({ description: '发送人ID', example:'发送人ID' })
    send_user_id: string

}


