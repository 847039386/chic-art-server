// 权限表
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document ,Types } from 'mongoose';

export type PermissionDocument = Permission & Document;

export enum PermissionType {
    API = 'API',   
    MENU = 'MENU',
    BTN = 'BTN',
}

@Schema({
    collection: 'permission',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    }
})
export class Permission extends Document {
    // 权限名称
    @Prop({ required: true })
    name: string
    // 描述
    @Prop({ required: true })
    description: string
    // true：开启 ，false：不开启
    @Prop({ default : true })
    available: boolean
    // 父节点，指向自己
    @Prop({ type: Types.ObjectId, ref: 'Permission' })
    parent_id: Permission
    // 权限类型
    @Prop({ required: true })
    type: PermissionType
    // 权限代码
    @Prop({ required: true })
    code: string
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);