
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
    name: String
    // 用户昵称
    @Prop({ required: true })
    nickname: String
    // 用户手机
    @Prop({  })
    phone: Number
    // 用户状态
    @Prop({ default:0 })
    state: Number
    // 用户头像地址
    @Prop({  })
    avatar:String
}

export const UserSchema = SchemaFactory.createForClass(User);