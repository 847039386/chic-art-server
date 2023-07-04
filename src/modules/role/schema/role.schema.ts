
// 角色表
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema()
export class Role extends Document {
    // 角色名称
    @Prop({ required: true })
    name: String
    // 描述
    @Prop({ required: true })
    description: String
    // 0：不可用 1：可用
    @Prop({ default : 1 })
    available: Number
    // 创建时间
    @Prop({ default :Date.now })
    create_tiem:Date
    // 修改时间
    @Prop({ default:Date.now })
    update_tiem:Date
}

export const RoleSchema = SchemaFactory.createForClass(Role);