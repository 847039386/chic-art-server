
/**
 * 系统日志表
 * 该表只存ip，访问类型，访问地址，访问值，返回值
 */

import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type RequestLogDocument = RequestLog & Document;

@Schema({
    collection: 'request_log',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    },
})
export class RequestLog extends Document {
    // 操作ip
    @Prop({  })
    ip:String
    // HTTP响应状态码
    @Prop({  })
    status_code: Number
    // 错误码
    @Prop({  })
    error_code: Number
    // 请求方法
    @Prop({  })
    request_method :String
    // 响应时间
    @Prop({  })
    response_time :Number
    // api地址
    @Prop({  })
    api:String
    // 访问值
    @Prop({ type :Object })
    request:Object
    // 返回值
    @Prop({ type :Object  })
    response:Object
    // 平台
    @Prop({ })
    platform:String
}

export const RequestLogSchema = SchemaFactory.createForClass(RequestLog);