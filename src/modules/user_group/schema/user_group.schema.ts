/**
 * 用户组表
 * 这里关注的是两个字段available与optional
 * 当available为true的时候，该组下面的所有角色权限生效，反而异之
 * 当optional为true的时候，该组将暴漏在前端页面之上可供用户选择分组
 * ！注意：这里暴漏的是用户组的名称并非是用户组下角色的名称
 * 用户与角色之间要通过用户组关联用户组在与角色关联，而不是用户直接对角色进行关联
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document ,Types } from 'mongoose';

export type UserGroupDocument = UserGroup & Document;

@Schema({
    collection: 'user_group',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    }
})
export class UserGroup extends Document {
    // 用户组名称
    @Prop({ required: true })
    name: String
    // 类型，0为可访问 1是可授权
    @Prop({ default: 0 })
    type: number
    // 描述
    @Prop({ required: true })
    description: String
    // true：开启 false、不开启
    @Prop({ default : true })
    available: Boolean
    // 父节点，指向自己
    @Prop({ type: Types.ObjectId, ref: 'UserGroup' })
    parent_id: UserGroup
}

export const UserGroupSchema = SchemaFactory.createForClass(UserGroup);