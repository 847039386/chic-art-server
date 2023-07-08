
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
    // 用户昵称
    @Prop({ required: true })
    name: String
    // 用户状态
    @Prop({ default:0 })
    state: Number
    // 用户头像地址
    @Prop({  })
    avatar:String
}

export const UserSchema = SchemaFactory.createForClass(User);