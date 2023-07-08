
// 角色表
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({
    collection: 'role',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    }
})
export class Role extends Document {
    // 角色名称
    @Prop({ required: true })
    name: String
    // 描述
    @Prop({ required: true })
    description: String
    // 0：不可用 1：可用
    @Prop({ default : true })
    available: boolean
}

export const RoleSchema = SchemaFactory.createForClass(Role);