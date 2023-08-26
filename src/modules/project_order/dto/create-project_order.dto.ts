import { ApiProperty } from '@nestjs/swagger';
import {  IsString ,IsInt, IsArray } from 'class-validator';

interface IEmployeeIds {
    _id :string,
    user_id:string
}

export class CreateProjectOrderDto {
    // 公司ID
    @IsString()
    @ApiProperty({ description: '项目名称', example:'项目名称' })
    name: string
    // 公司ID
    @IsString()
    @ApiProperty({ description: '公司ID', example:'工程模板' })
    company_id: string
    /**
     * 后台有一个progress_template表，但是这里不与该表ID所连接，而是将他的数据复制到这里
     */
    @IsString()
    @ApiProperty({ example:['开始','中间','结束'] ,description: '进度模板是数组，后台有一个progress_template表，但是这里不与该表ID所连接，而是将他的数据复制到这里' })
    progress_template: string []
    // 进度步数
    @ApiProperty({ description: '进度步数，根据progress_template数组长度每次确认后添加1，直到到达他的长度', type: Number ,example :0 })
    @IsInt()
    step ?:number
    // 公司ID
    @IsString()
    @ApiProperty({ description: '客户名称', example:'王小二' })
    customer: string
    // 公司ID
    @IsString()
    @ApiProperty({ description: '项目地址', example:'河北省涿州市测试小区14号楼三单元201' })
    address: string
    // 公司ID
    @IsString()
    @ApiProperty({ description: '客户联系方式', example:'15122223333' })
    phone: string
    @IsString()
    @ApiProperty({ example:['company_employee_id'] ,description: '公司员工的id，数组' })
    employee_ids: IEmployeeIds []

}

export class ProjectOrderListAllDto {

    @ApiProperty({ description: '页数', type: Number ,example :1 })
    @IsInt()
    page ?:number
    @ApiProperty({ description: '每页数量', type: Number ,example :10 })
    @IsInt()
    limit ?:number
    
}

export class ProjectOrderListByCompanyIdDto {
    @ApiProperty({ description: '页数', type: Number ,example :1 })
    @IsInt()
    page ?:number
    @ApiProperty({ description: '每页数量', type: Number ,example :10 })
    @IsInt()
    limit ?:number
    @ApiProperty({ description: '订单状态', type: Number ,example :0 })
    @IsInt()
    state ?:number
    @ApiProperty({ description: '公司id', type: String })
    @IsString()
    company_id :string
}