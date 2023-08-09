import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Company } from 'src/modules/company/schema/company.schema';

export type ProjectOrderDocument = ProjectOrder & Document;

@Schema({
    collection: 'project_order',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    }
})
export class ProjectOrder extends Document {
    // 公司ID
    @Prop({ type: Types.ObjectId, ref: 'Company' ,required:true })
    company_id: Company
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