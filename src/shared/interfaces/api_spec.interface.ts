
// 所有API返回的应该是这种格式，在交给全局拦截器加其他字段
import { IOperatorLog } from './log.interface'
export interface IApiPagination {
    currentPage :number
    pageSize :number
    totalPage:number
    total :number
    rows :any
}

export interface IApiSpec<T = any> {
    result : {
       success :boolean
       code :number
       message :string
       api :string
       data :T
    },
    operator? :IOperatorLog,
    config:IApiAmendConfig,
}

export interface IApiAmendConfig {
    api_type : string,
    is_take_response :boolean,
    is_save_requestLog :boolean,
    is_save_operator :boolean,
    is_api_format ?:boolean

}
