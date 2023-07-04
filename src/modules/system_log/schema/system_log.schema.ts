
/**
 * 系统日志表
 * 该表只存ip，访问类型，访问地址，访问值，返回值
 */

import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SystemLogDocument = SystemLog & Document;

@Schema()
export class SystemLog extends Document {
    // 操作ip
    @Prop({  })
    ip:String
    // HTTP响应状态码
    @Prop({  })
    status_code: Number
    // 请求方法
    @Prop({  })
    request_method :String
    // 响应时间
    @Prop({  })
    response_time :Number
    // url地址
    @Prop({  })
    url:String
    // 访问值
    @Prop({ type :Object })
    request:Object
    // 返回值
    @Prop({ type :Object  })
    response:Object
    // 平台
    @Prop({ })
    platform:String
    // 创建时间
    @Prop({ default :Date.now })
    create_tiem:Date
    // 修改时间
    @Prop({ default:Date.now })
    update_tiem:Date
}

export const SystemLogSchema = SchemaFactory.createForClass(SystemLog);