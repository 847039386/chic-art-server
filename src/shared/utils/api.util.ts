
import { IApiAmendConfig } from "src/shared/interfaces/api_spec.interface"
import { ResultCode } from 'src/shared/utils/base_exception.util'

interface IapiData {
    
    apiType? :string,   // 路径类型，例如Api、View、Soket、Rtmp ，在权限浏览器中根据类型，筛选什么类型做什么样的判定
    isTakeResponse? :boolean  // 是否记录返回值，true记录，false为不记录，全局拦截器会根据这个将整个页面的响应值记录到数据库内 默认，开启 建议列表查询的时候关闭掉。
    isSaveRequestLog? :boolean   // 是否将记录保存到请求表 默认开启
    isSaveOperator? :boolean // 是否将数据保存到操作表 默认关闭
    // 这里不赋值type，type在全局获取请求方法的时候获取 ,API也是一样
    operator ?:operatorRequired    // 当这里you'zhi
}

interface operatorRequired {
    user_id :string,
    type:string,
    module :string  
    subject :string 
    description :string,
}


export const apiAmendFormat = (data :any,config_info? :IapiData) =>{
    let result = { }         
    let code = ResultCode.SUCCESS.code
    let message = ResultCode.SUCCESS.message
    let success = true;

    result = { success ,code ,message ,data }

    let operator  = { }

    let config :IApiAmendConfig = {
        is_api_format :true,
        api_type :'API',
        is_take_response :true ,
        is_save_requestLog :true ,
        is_save_operator :false 
    }

    if(config_info){
        config = {
            is_api_format :true,
            api_type : config_info.apiType || 'API',
            is_take_response :typeof config_info.isTakeResponse =='undefined' ? false :config_info.isTakeResponse,
            is_save_requestLog :typeof config_info.isSaveRequestLog =='undefined' ? true :config_info.isSaveRequestLog,
            is_save_operator :typeof config_info.isSaveOperator =='undefined' ? false :config_info.isSaveOperator,
        }
        if(config_info.operator){
            config.is_save_operator = true,
            operator = {
                user_id :config_info.operator.user_id,
                module :config_info.operator.module,
                subject : config_info.operator.subject,
                type:config_info.operator.type,
                error_code :code,
                message,
                description :config_info.operator.description,
            }
        }else{
            config.is_save_operator = false
        }
    }
    return { result ,operator ,config }
} 