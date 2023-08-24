import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, ServiceUnavailableException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

    catch(exception :Error, host: ArgumentsHost) {
        console.log('真就不走我呗')
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        // 非 HTTP 标准异常的处理。
        let response_start_time :number = Number(request.res.getHeader('response-start-time'))
        response.status(HttpStatus.OK).send({
            success:false,
            code :-1,
            statusCode: HttpStatus.OK,
            path: request.path,
            message:'失败',
            e_message :exception.message,
            time:Date.now() - response_start_time 
            // message: new ServiceUnavailableException().getResponse(),
        });
    }
}

