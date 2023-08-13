import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, ServiceUnavailableException } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from 'src/shared/utils/base_exception.util'

@Catch(BaseException)
export class AllExceptionsFilter implements ExceptionFilter {

    catch(exception :BaseException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        // 非 HTTP 标准异常的处理。
        console.log(exception,'来到了这里')
        let response_start_time :number = Number(request.res.getHeader('response-start-time'))
        response.status(HttpStatus.OK).send({
            success:false,
            code :exception.code,
            statusCode: HttpStatus.OK,
            path: request.path,
            message:exception.message,
            e_message:exception.e_message,
            time:Date.now() - response_start_time 
            // message: new ServiceUnavailableException().getResponse(),
        });
    }
}