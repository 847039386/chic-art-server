import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, ServiceUnavailableException } from '@nestjs/common';
import { Request, Response } from 'express';
import { IApiAmendConfig } from 'src/shared/interfaces/api_spec.interface'
import { RequestLogService } from 'src/modules/request_log/request_log.service'; 
import { ErrorCodes, OperatorException } from 'src/shared/utils/base_exception.util'
import { OperatorLogService } from 'src/modules/operator_log/operator_log.service'
import { getRequestParams } from 'src/shared/utils/tools.util';
import { Types } from 'mongoose';

// 操作日志，如用户有userid并且操作了那报错将会连同访问日志和操作日志一起储存表
@Catch(OperatorException)
export class OperatorExceptionsFilter implements ExceptionFilter {
    
    constructor(private readonly requestLogService: RequestLogService, private readonly operatorService:OperatorLogService) {}

    catch(exception :OperatorException, host: ArgumentsHost) {
        console.log('OperatorException')
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const response_start_time :number = Number(request.res.getHeader('response-start-time'))
        // 非 HTTP 标准异常的处理。

        let ip = request.ip;
        let api = request.path;
        let status_code = request.res.statusCode;
        let request_method = request.method;
        let platform = request.headers['user-agent'];
        let z_message = exception.message;
        let e_message = exception.e_message;
       
        /**
         * e_message 信息不是自己设置的，例如越过前端存库。存了一个唯一值 ，数据库肯定会报错，抛出异常到这里，
         * e_message是系统的错误，而message是自己设置的错误值，存库存真实错误，但给用户的json为自己设置的错误值
         * 一般业务逻辑不主动抛出error
         * 简单来说如果遇到服务器错误，存数据的的都是真实error和给用户的都是自定义error
         */
        let message = e_message || z_message
        let error_code = exception.code;

        if(exception.is_save_requestLog){
            let responseData;
            if(exception.is_take_response){
                responseData = { code :error_code , message}
            }
            this.requestLogService.create({ip ,status_code ,request_method ,api ,platform,
                error_code,
                response_time :Date.now() - response_start_time,
                request: getRequestParams(request),
                response:responseData,
            });
        } 
        
        if(exception.operator && exception.is_save_operator && exception.operator.user_id){
            let operator = exception.operator;
            this.operatorService.create({
                ip,
                user_id :exception.operator.user_id,
                api,
                error_code,
                message,
                platform,
                request_method,
                module:operator.module,
                subject :operator.subject,
                type:operator.operatorType,
                description:operator.description,
            })
        }


        // 这里给用户的错误code和信息都是自定义的
        response.status(HttpStatus.OK).send({ success:false ,code :error_code ,message:z_message });
    }
}