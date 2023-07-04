import {  IsString ,IsInt ,IsDate ,IsObject} from 'class-validator';
export class CreateSystemLogDto {
    // 操作ip
    @IsString()
    ip:String
    // HTTP响应状态码
    @IsInt()
    status_code: Number
    // 请求方法
    @IsString()
    request_method :String
    // url地址
    @IsString()
    url:String
    // 响应时间
    @IsInt()
    response_time :Number
    // 访问值
    @IsObject()
    request:Object
    // 返回值
    @IsObject()
    response:Object
    // 平台
    @IsString()
    platform:String
    // 创建时间
    @IsDate()
    create_tiem?:Date
    // 修改时间
    @IsDate()
    update_tiem?:Date
}
