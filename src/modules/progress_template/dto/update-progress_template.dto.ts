import { ApiProperty } from '@nestjs/swagger';
import {  IsString  } from 'class-validator';

export class UpdateProgressTemplateDto {
    // 模板ID
    @IsString()
    @ApiProperty({ description: '进度模板ID', example:'id' })
    id: string
    // 模板名称
    @IsString()
    @ApiProperty({ description: '进度模板名称', example:'工程模板' })
    name: string
    // 模板数据
    @IsString()
    @ApiProperty({ description: '进度模板是数组', example:['开始','中间','结束'] })
    template: [string]
}
