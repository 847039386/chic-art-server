import { ApiProperty } from '@nestjs/swagger';
import {  IsString  } from 'class-validator';
export class CreateProgressTemplateDto {
    // 进度模板名称
    @IsString()
    @ApiProperty({ description: '进度模板名称', example:'工程模板' })
    name: string
    // 进度模板数据
    @IsString()
    @ApiProperty({ description: '进度模板是数组', example:['开始','中间','结束'] })
    template: [string]
}
