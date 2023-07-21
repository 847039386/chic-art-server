
/**
 * 日志表
 * 应用场景：如用户绑定了微信账号。那么操作类型应该是：新增，操作模块：绑定账户，操作对象：微信绑定。
 * 应用场景：如用户修改了手机号。那么操作类型应该是：修改，操作模块：用户管理，操作对象：手机 
 * 应用场景：如用户添加文章。那么操作类型应该是：新增，操作模块：文章管理 
 * 
 * 在有些场景操作对象可以为空，但是有些情况比如用户单门上传并修改头像的时候，操作对象可以记录用户具体对那个模块做了什么，也可以说是二级分类
 * 这样就可以记录用户，类型：修改，模块：用户管理，对象：图片
 * 或者：修改，权限，权限名称
 * 
 * 当然这里的user_id是可以为空的，因为比如说用户注册的时候操作人不可以是自己，是自己也不符合逻辑。所以在前端可以判定当user_id为空的时候，操作人可以是：服务器或host
 */

import { Document ,Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/modules/user/schema/user.schema'

export type OperatorLogDocument = OperatorLog & Document;

@Schema({
    collection: 'operator_log',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    }
})
export class OperatorLog extends Document {
    // 用户ID required: true ,
    @Prop({ type: Types.ObjectId, ref: 'User' })
    user_id: User
    // 请求方法 PUT DELETE GET POST 
    @Prop({  })
    request_method :string
    // 错误信息
    @Prop()
    message :string
    // 错误码 0成功 其他都是失败
    @Prop({  })
    error_code: number
    // 操作类型
    @Prop({  })
    type: string
    // 模块信息
    @Prop({})
    module :string
    // 操作对象     
    @Prop({  })
    subject: string
    // 操作api地址
    @Prop({  })
    api:string
    // 操作ip
    @Prop({  })
    ip:string
    // 操作描述
    @Prop({  })
    description:string
    // 平台 记录用户用什么设备访问 User-Agent
    @Prop({ })
    platform:string
    // 修改前数据
    @Prop({ })
    old_data:string
}

export const OperatorLogSchema = SchemaFactory.createForClass(OperatorLog);