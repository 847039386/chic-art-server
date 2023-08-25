import { Types } from 'mongoose'
import * as MAY_ERROR from 'src/shared/data/result_code.data'
export const ResultCode = MAY_ERROR.ResultCode

interface IIsRecordBase{
    isTakeResponse? :boolean 
    isSaveRequestLog? :boolean   
}

interface IExceptionBase{
    code? :number 
    message? :string   
}

export class BaseException {
    code :number;
    message :string;
    e_message:string;
    is_take_response:boolean
    is_save_requestLog:boolean
    constructor(exception :IExceptionBase ,recordConfig? :IIsRecordBase ,error?){
        this.code = exception.code
        this.message = exception.message
        if(recordConfig){
            this.is_take_response  = typeof recordConfig.isTakeResponse =='undefined' ? true :recordConfig.isTakeResponse
            this.is_save_requestLog = typeof recordConfig.isSaveRequestLog =='undefined' ? true :recordConfig.isSaveRequestLog  //默认记录请求日志
        }else{
            this.is_take_response  =  false 
            this.is_save_requestLog = true  //默认记录请求日志
        }

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