import {  IsString ,IsInt ,IsDate ,IsObject} from 'class-validator';
export class CreateOperatorLogDto {

    // 用户ID
    @IsString()
    user_id : any
    // 请求方法 PUT DELETE GET POST
    @IsString()
    request_method :string
    // 错误信息
    @IsString()
    message? :string
    // 错误码 0为成功，其他都为失败
    @IsInt()
    error_code: number
    // 操作类型
    @IsString()
    type: string
    // 模块信息
    @IsString()
    module :string
    // 操作对象     
    @IsString()
    subject ?: string
    // 操作api地址
    @IsString()
    api:string
    // 操作ip
    @IsString()
    ip:string
    // 操作描述
    @IsString()
    description:string
    // 平台 记录用户用什么设备访问 User-Agent
    @IsString()
    platform:String
    // 修改前数据
    @IsString()
    old_data? :String
    // 创建时间
    @IsDate()
    create_tiem? :Date
    // 修改时间
    @IsDate()
    update_tiem? :Date
}
