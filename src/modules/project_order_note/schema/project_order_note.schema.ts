
// 角色表
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProjectOrder } from 'src/modules/project_order/schema/project_order.schema'
import { Document, Types } from 'mongoose';

export type ProjectOrderNoteDocument = ProjectOrderNote & Document;

@Schema({
    collection: 'project_order_note',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    }
})

export class ProjectOrderNote extends Document {
    // 工程订单ID,
    @Prop({ type: Types.ObjectId, ref: 'ProjectOrder' ,required:true })
    project_order_id: ProjectOrder
    //标题
    @Prop({ required:true ,default:'笔记标题'})
    title:string
    //内容
    @Prop({ required:true ,default:'笔记内容'})
    content :string
    /**
     * 工程订单监控状态
     * 0：允许所有人查看
     * 1：仅项目负责人
     * 2: 仅员工
     * 3：仅客户
     */
    @Prop({ type: Number ,required:true ,default: 0 })
    state: number


}

export const ProjectOrderNoteSchema = SchemaFactory.createForClass(ProjectOrderNote);