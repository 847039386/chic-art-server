
// 角色表
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TagDocument = Tag & Document;

@Schema({
    collection: 'tag',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    }
})
export class Tag extends Document {
    // 标签名称
    @Prop({ required: true })
    name: String
}

export const TagSchema = SchemaFactory.createForClass(Tag);