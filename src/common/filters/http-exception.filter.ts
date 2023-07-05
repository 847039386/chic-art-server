import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, } from '@nestjs/common';
import { Request, Response } from 'express';
import { RequestLogService } from 'src/modules/request_log/request_log.service';
import { ResultCode } from 'src/shared/utils/base_exception.util';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

    constructor(private readonly requestLogService: RequestLogService) {}

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR; // 获取异常状态码

        let response_start_time :number = Number(request.res.getHeader('response-start-time'))

        const errorResponse = {
            success :false,
            code : -1,
            data: {
                path: request.url,
                status_code: status,
            },
            message : exception.message,
            response_time :0,     
        };
        // 设置返回的状态码， 请求头，发送错误信息
        this.requestLogService.create({ 
            ip:request.ip,
            status_code:status,
            request_method:request.method, 
            api:request.path, 
            error_code : ResultCode.ERROR.code,
            response_time : Date.now() - response_start_time,        
            request: request.params,
            response:errorResponse,
            platform:request.headers['user-agent']
        });
        
        response.status(status);
        response.header('Content-Type', 'application/json; charset=utf-8');
        response.send(errorResponse);

    }
}