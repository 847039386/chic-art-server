import { Types} from 'mongoose'
import { ErrorCodes } from 'src/shared/data/error_codes.data'
import { IOperatorLog } from 'src/shared/interfaces/log.interface'
import { IApiAmendConfig } from "src/shared/interfaces/api_spec.interface"


// export enum ApiTypes {
//     API = 'API',        //api类型
//     OPERATOR = 'OPERATOR',  //操作类型
//     SYSTEM ='SYSTEM'    //系统类型
// }

interface IapiDecorator {
    operatorType:string
    apiType? :string,   // 路径类型，例如Api、View、Soket、Rtmp ，在权限浏览器中根据类型，筛选什么类型做什么样的判定
    isTakeResponse? :boolean  // 是否记录返回值，true记录，false为不记录，全局拦截器会根据这个将整个页面的响应值记录到数据库内 默认，开启 建议列表查询的时候关闭掉。
    isSaveRequestLog? :boolean   // 是否将记录保存到请求表 默认开启
    isSaveOperator? :boolean //是否将数据保存到操作表 默认开启
    // 这里不赋值type，type在全局获取请求方法的时候获取 ,API也是一样
    module :string  //操作模块
    subject :string //操作主题
}

interface ICompulsionOperatorFormat {
    user_id :Types.ObjectId,
    description:string
}

// export const ApiAmendDecorator = (config_info :IapiDecorator) => {
//     return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
//         // 被装饰的函数
//         // 此装饰器将统一格式化返回值，将所有的错误信息都初始为成功，如需逻辑判定修改code，直接抛出异常即可，拦截器将返回各种消息和各种code码

//         const method = descriptor.value;
//         descriptor.value = async function (...args: any[]) {
//             let result = { }         
//             let results = await method.apply(this, args)
//             let code = ErrorCodes.SUCCESS.code
//             let message = ErrorCodes.SUCCESS.message
//             let success = true;

//             result = { success ,code ,message ,data :results.data }

//             let operator :IOperatorLog = {
//                 state : 1,
//                 module :config_info.module,
//                 subject : config_info.subject,
//                 type:config_info.operatorType,
//                 error_code :code,
//                 message,
//                 description :results.description,
//             }

//             if(results.user_id){
//                 operator.user_id = results.user_id
//             }

//             let config :IApiAmendConfig = {
//                 is_api_format :true,
//                 api_type : config_info.apiType || 'API',
//                 is_take_response :typeof config_info.isTakeResponse =='undefined' ? true :config_info.isTakeResponse,
//                 is_save_requestLog :typeof config_info.isSaveRequestLog =='undefined' ? true :config_info.isSaveRequestLog,
//                 is_save_operator :typeof config_info.isSaveOperator =='undefined' ? false :config_info.isSaveOperator,
//             }

//             // 判定如果操作人为空，那么将不保存数据到操作日志中，即便是设置了is_save_operator
//             if(!operator.user_id){
//                 config.is_save_operator = false
//             }
//             return { result ,operator ,config }
//         };

        
//         return descriptor;
//     }
// }

// // operator为可选参数，如不填写一定入不了操作记录，填写后必定要填写其特有属性
// export const compulsionFormat = (data :any ,operator?:ICompulsionOperatorFormat) => {
//     if(!operator){
//         return { 
//             data,
//         }
//     }else{
//         return { 
//             data,
//             user_id :operator.user_id,
//             description :operator.description,
//         }
//     }
// }


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
    let code = ErrorCodes.SUCCESS.code
    let message = ErrorCodes.SUCCESS.message
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
            is_take_response :typeof config_info.isTakeResponse =='undefined' ? true :config_info.isTakeResponse,
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