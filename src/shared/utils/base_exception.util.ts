import { Types } from 'mongoose'
import * as MAY_ERROR from 'src/shared/data/result_code.data'
export const ResultCode = MAY_ERROR.ResultCode

// 此方法都是主动抛出异常

interface operatorRequired {
    user_id ?:Types.ObjectId,
    operatorType:string,
    module :string,
    subject? : string,
    description :string,
}



interface IIsRecordBase{
    isTakeResponse? :boolean 
    isSaveRequestLog? :boolean   
}

interface IIsRecordOperator extends IIsRecordBase {
    isSaveOperator? :boolean //是否将数据保存到操作表 默认开启
}


export class OperatorException {
    operator :operatorRequired 
    code :number;
    message :string;
    e_message : string;
    is_take_response:boolean
    is_save_requestLog:boolean
    is_save_operator:boolean
    constructor(exception ,operator :operatorRequired ,recordConfig :IIsRecordOperator ,error? ){
        this.operator = operator
        this.code = exception.code
        this.message = exception.message
        this.is_take_response  = typeof recordConfig.isTakeResponse =='undefined' ? true :recordConfig.isTakeResponse
        this.is_save_requestLog = typeof recordConfig.isSaveRequestLog =='undefined' ? true :recordConfig.isSaveRequestLog  //默认记录请求日志
        this.is_save_operator  = typeof recordConfig.isSaveOperator =='undefined' ? false :recordConfig.isSaveOperator      // 默认不记录操作日志
        if(error){ 
            if(error.code && error.code != ResultCode.ERROR.code){
                this.message = error.message
            }
            if(error.code){
                this.code = error.code
            }
            this.e_message = error.message
        }
    }

}    

export class BaseException {
    code :number;
    message :string;
    e_message:string;
    is_take_response:boolean
    is_save_requestLog:boolean
    constructor(exception ,recordConfig :IIsRecordBase ,error?){
        this.code = exception.code
        this.message = exception.message
        this.is_take_response  = typeof recordConfig.isTakeResponse =='undefined' ? true :recordConfig.isTakeResponse
        this.is_save_requestLog = typeof recordConfig.isSaveRequestLog =='undefined' ? true :recordConfig.isSaveRequestLog  //默认记录请求日志
        if(error){ 

            if(error.code && error.code != ResultCode.ERROR.code){
                this.message = error.message
            }

            if(error.code){
                this.code = error.code
            }
            if(error.e_message){
                this.e_message = error.e_message
            }else{
                this.e_message = error.message
            }
        }
    }
}