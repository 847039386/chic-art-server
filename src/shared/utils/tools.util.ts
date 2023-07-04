import { Request } from 'express'
import { randomBytes } from 'crypto'

// 获取requests参数
export const getRequestParams = (request :Request) =>{
    let params = {}
    if(request.method == 'GET'){
        if(Object.keys(request.params).length > 0){
            params = request.params
        }else if(Object.keys(request.query).length > 0){
            params = request.query
        }
    }else{
        params = request.body
    }
    return params
}
