import {  IsString ,IsInt ,IsDate ,IsObject} from 'class-validator';
import { PermissionType } from '../schema/permission.schema'

export class CreatePermissionDto {
    // 操作ip
    @IsString()
    name:string
    // HTTP响应状态码
    @IsInt()
    description: number
    // 请求方法
    @IsString()
    available :boolean
    // api地址
    @IsString()
    parent_id:string
    // 响应时间
    @IsInt()
    type :PermissionType
    // 访问值
    @IsObject()
    code:string
    // 创建时间
    @IsDate()
    create_tiem?:Date
    // 修改时间
    @IsDate()
    update_tiem?:Date

}
