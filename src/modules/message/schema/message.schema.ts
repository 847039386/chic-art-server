// 角色表
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({
    collection: 'message',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    }
})
/**
 * 简单的消息系统
 * 当用户执行某些操作时，比如申请公司被拒绝，那么详细类型为系统消息，这个时候发送人是系统，所以不需要发送人
 * 当用户给管理员留言时，不需要接收人，那么接收人可以为空
 */
export class Message extends Document {
    // 标签名称
    @Prop({ required: true })
    title: string
    // 消息内容
    @Prop({ required: true })
    content: string
    // 消息发送人，可为空
    @Prop({  })
    send_user_id: string
    // 消息接收人，可为空
    @Prop({  })
    recv_user_id: string
    /**
     * 消息类型，不许为空
     * 0：系统消息，发送人为空
     * 1：留言板，用户给管理员留言
     */
    @Prop({ required: true })
    type: number

}

export const MessageSchema = SchemaFactory.createForClass(Message);