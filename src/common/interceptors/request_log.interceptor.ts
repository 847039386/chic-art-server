import {Injectable, NestInterceptor,ExecutionContext,CallHandler, HttpException ,HttpStatus} from '@nestjs/common';
import { Request } from 'express'
import { map } from 'rxjs/operators';
import { getRequestParams } from 'src/shared/utils/tools.util'
import { IApiAmendConfig } from 'src/shared/interfaces/api_spec.interface'
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util'
import { CreateOperatorLogDto } from 'src/modules/operator_log/dto/create-operator_log.dto';
import { RequestLogService } from 'src/modules/request_log/request_log.service';
import { OperatorLogService } from 'src/modules/operator_log/operator_log.service';

@Injectable()
export class RequestInterceptor implements NestInterceptor {

    constructor(private readonly requestLogService: RequestLogService, private readonly operatorService:OperatorLogService) {}

    // 拦截所有API 将信息传送给系统日志表
    intercept(context: ExecutionContext, next: CallHandler): any {
        const host = context.switchToHttp();
        const request = host.getRequest<Request>();
        const response_start_time :number = Number(request.res.getHeader('response-start-time'))
        return next
            .handle()
            .pipe(
                map((data :any) =>
                    {
                        /**
                         * 全局拦截下页面获取页面的返回值 data 也就是响应结果
                         * 而code是自己设置的错误码分类0为成功
                         */
                        try {
                            let config :IApiAmendConfig = data.config;
                            let operator :CreateOperatorLogDto = data.operator;
                            let result = data.result;

                            if(config && operator && result){
                                let ip = request.ip;
                                let api = request.path;
                                let status_code = request.res.statusCode;
                                let request_method = request.method;
                                let platform = request.headers['user-agent'];
                                
                                
                                if(config.is_save_requestLog && config.api_type == "API"){
                                    let responseData;
                                    if(config.is_take_response){
                                        responseData = result
                                    }

                                    this.requestLogService.create({ip ,status_code ,request_method ,api ,platform,
                                        error_code :ResultCode.SUCCESS.code,
                                        response_time :Date.now() - response_start_time,
                                        request: getRequestParams(request),
                                        response:responseData,
                                    });
                                }
                                if(config.is_save_operator && config.api_type == "API"){
                                    operator = Object.assign(operator,{api ,ip ,platform ,request_method ,error_code :operator.error_code})
                                    this.operatorService.create(operator)
                                }

                                return result;
                            }else{
                                return data
                            }
                        } catch (error) {
                            // var nems = JSON.stringify({ message : "格式错误" ,start })
                            throw new BaseException(ResultCode.ERROR,{});
                        }

                    }
                ),
            );
    }
}
