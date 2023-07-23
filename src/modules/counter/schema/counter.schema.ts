// 用户账号表
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../user/schema/user.schema'
import { Document ,Types } from 'mongoose';

export type CounterDocument = Counter & Document;

@Schema({
    collection: 'counter',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    },
})
export class Counter extends Document {
    // 用户ID
    @Prop({ required: true ,type: String ,unique :true })
    sequence_id: string
    // 登陆类型
    @Prop({ required: true ,type:Number })
    sequence_value: number
}

export const CounterSchema = SchemaFactory.createForClass(Counter);