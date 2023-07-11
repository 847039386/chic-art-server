
// 角色权限表 此表将角色与权限关联
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document ,Types } from 'mongoose';
import { Role } from '../../role/schema/role.schema'
import { Permission } from '../../permission/schema/permission.schema';

export type RolePermissionDocument = RolePermission & Document;

@Schema({
    collection: 'role_permission',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    }
})
export class RolePermission extends Document {
    // 角色ID
    @Prop({ type: Types.ObjectId, ref: 'Role' ,required: true})
    role_id: Types.ObjectId
    // 权限ID
    @Prop({ type: Types.ObjectId, ref: 'Permission' ,required: true })
    permission_id: Types.ObjectId
}

export const RolePermissionSchema = SchemaFactory.createForClass(RolePermission);