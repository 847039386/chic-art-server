import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectOrderDocument = ProjectOrder & Document;

@Schema({
    collection: 'project_order',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    }
})
export class ProjectOrder extends Document {
    // 进度模板名称
    @Prop({ required: true })
    company_id: string
    /**
     * 后台有一个progress_template表，但是这里不与该表ID所连接，而是将他的数据复制到这里
     */
    @Prop({ required: true })
    progress_template: [string]
    // 进度步数
    @Prop({ required: true ,default:0 })
    step: number
}

export const ProjectOrderSchema = SchemaFactory.createForClass(ProjectOrder);