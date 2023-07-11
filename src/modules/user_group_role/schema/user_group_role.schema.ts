
// 用户组角色表 此表将角色与用户组所关联
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document ,Types } from 'mongoose';
import { Role } from '../../role/schema/role.schema'
import { UserGroup } from '../../user_group/schema/user_group.schema';

export type UserGroupRoleDocument = UserGroupRole & Document;

@Schema({
    collection: 'user_group_role',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    }
})
export class UserGroupRole extends Document {
    // 角色ID
    @Prop({ type: Types.ObjectId, ref: 'Role' ,required: true })
    role_id: Role
    // 用户组ID
    @Prop({ type: Types.ObjectId, ref: 'UserGroup' ,required: true })
    user_group_id: UserGroup
}

export const UserGroupRoleSchema = SchemaFactory.createForClass(UserGroupRole);