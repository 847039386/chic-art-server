
// 用户用户组表 此表将用户与用户组关联
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document ,Types } from 'mongoose';
import { User } from '../../user/schema/user.schema'
import { UserGroup } from '../../user_group/schema/user_group.schema';

export type UserGroupUserDocument = UserGroupUser & Document;

@Schema()
export class UserGroupUser extends Document {
    // 用户ID
    @Prop({ type: Types.ObjectId, ref: 'User' ,required: true })
    user_id: User
    // 用户组ID
    @Prop({ type: Types.ObjectId, ref: 'UserGroup' ,required: true })
    user_group_id: UserGroup
    // 创建时间
    @Prop({ default :Date.now })
    create_tiem:Date
    // 修改时间
    @Prop({ default:Date.now })
    update_tiem:Date
}

export const UserGroupUserSchema = SchemaFactory.createForClass(UserGroupUser);