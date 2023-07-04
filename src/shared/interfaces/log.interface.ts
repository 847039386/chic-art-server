import { User } from "../../modules/user/schema/user.schema"

export interface IOperatorLog {
    /** 操作人ID */
    user_id?: User
    /** 错误码 0为成功 */
    error_code?:number
    /** 错误信息或成功信息 */
    message?: String
    /** 
     * 操作状态 
     * 1：成功
     * 0：失败
     */
    state:Number
    /** 操作类型，可以理解为行为，PUT DELET GET POST等 */
    type?:String
    /** 操作模块 */
    module:String
    /** 操作对象 */
    subject?:String
    /** 操作API地址 */
    api?:String
    /** 操作IP */
    ip?:String
    /** 操作描述 */
    description?:String
    /** 操作平台 */
    platform?:String
    /** 创建时间 */
    create_tiem?:Date
    /** 修改时间 */
    update_tiem?:Date
}
