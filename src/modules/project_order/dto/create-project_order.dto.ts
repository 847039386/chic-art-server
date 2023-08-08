import { ApiProperty } from '@nestjs/swagger';
import {  IsString ,IsInt, IsArray } from 'class-validator';

export class CreateProjectOrderDto {
    // 公司ID
    @IsString()
    @ApiProperty({ description: '公司ID', example:'工程模板' })
    company_id: string
    /**
     * 后台有一个progress_template表，但是这里不与该表ID所连接，而是将他的数据复制到这里
     */
    @IsString()
    @ApiProperty({ example:['开始','中间','结束'] ,description: '进度模板是数组，后台有一个progress_template表，但是这里不与该表ID所连接，而是将他的数据复制到这里' })
    progress_template: [string]
    // 进度步数
    @ApiProperty({ description: '进度步数，根据progress_template数组长度每次确认后添加1，直到到达他的长度', type: Number ,example :0 })
    @IsInt()
    step ?:number
}

export class ProjectOrderListAllDto {

    @ApiProperty({ description: '页数', type: Number ,example :1 })
    @IsInt()
    page ?:number
    @ApiProperty({ description: '每页数量', type: Number ,example :10 })
    @IsInt()
    limit ?:number
    
}

export class ProjectOrderListByCompanyDto {
    @ApiProperty({ description: '页数', type: Number ,example :1 })
    @IsInt()
    page ?:number
    @ApiProperty({ description: '每页数量', type: Number ,example :10 })
    @IsInt()
    limit ?:number
    @ApiProperty({ description: '公司id', type: String })
    @IsString()
    company_id ?:string
}