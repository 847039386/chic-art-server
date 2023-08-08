
// 用户表
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
    collection: 'user',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    },
})
export class User extends Document {
    // 用户真实姓名
    @Prop({  })
    name: string
    // 用户昵称
    @Prop({ required: true })
    nickname: string
    // 用户手机
    @Prop({  })
    phone: number
    // 用户状态
    @Prop({ default:0 })
    state: number
    // 用户头像地址
    @Prop({  })
    avatar:string
}

export const UserSchema = SchemaFactory.createForClass(User);