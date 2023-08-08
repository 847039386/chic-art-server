
// 角色表
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProgressTemplateDocument = ProgressTemplate & Document;

@Schema({
    collection: 'progress_template',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    }
})
export class ProgressTemplate extends Document {
    // 进度模板名称
    @Prop({ required: true })
    name: string
    // 模板
    @Prop({ type: [String] ,required: true })
    template: [string]
}

export const ProgressTemplateSchema = SchemaFactory.createForClass(ProgressTemplate);