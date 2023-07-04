
// 用户组角色表 此表将角色与用户组所关联
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document ,Types } from 'mongoose';
import { Role } from '../../role/schema/role.schema'
import { UserGroup } from '../../user_group/schema/user_group.schema';

export type UserGroupRoleDocument = UserGroupRole & Document;

@Schema()
export class UserGroupRole extends Document {
    // 角色ID
    @Prop({ type: Types.ObjectId, ref: 'Role' ,required: true })
    role_id: Role
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

export const UserGroupRoleSchema = SchemaFactory.createForClass(UserGroupRole);