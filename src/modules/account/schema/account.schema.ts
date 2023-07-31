// 用户账号表
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../user/schema/user.schema'
import { Document ,Types } from 'mongoose';

export type AccountDocument = Account & Document;

export enum identityType {
    username = 'username',   
    wx = 'wx',
    qq = 'qq',
    mobile = 'mobile',
    email = 'email'
}

@Schema({
    collection: 'account',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    },
})
export class Account extends Document {
    // 用户ID
    @Prop({ required: true ,type: Types.ObjectId, ref: 'User' })
    user_id: User
    // 登陆类型
    @Prop({ required: true })
    identity_type: identityType
    // 手机号、邮箱、第三方的唯一标识
    @Prop({ required: true ,unique:true})
    identifier: string
    // 密码凭证、第三方、自建账号
    @Prop({ required: true })
    credential: string
    // 加盐
    @Prop({ required: true })
    salt:string
    @Prop({ default:Date.now })
    last_sign_time :Date
}

export const AccountSchema = SchemaFactory.createForClass(Account);