import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Company } from 'src/modules/company/schema/company.schema';
import { User } from 'src/modules/user/schema/user.schema';

export type ProjectOrderDocument = ProjectOrder & Document;

@Schema({
    collection: 'project_order',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    }
})
export class ProjectOrder extends Document {
    // 项目名称
    @Prop({ required: true })
    name: string
    // 公司ID
    @Prop({ type: Types.ObjectId, ref: 'User' ,required:true })
    user_id: User
    // 公司ID
    @Prop({ type: Types.ObjectId, ref: 'Company' ,required:true })
    company_id: Company
    /**
     * 后台有一个progress_template表，但是这里不与该表ID所连接，而是将他的数据复制到这里
     */
    @Prop({ required: true })
    progress_template: string []
    // 进度步数
    @Prop({ required: true ,default:-1 })
    step: number
    // 客户名称
    @Prop({ required: true })
    customer: string
    // 客户地址
    @Prop({ required: true })
    address: string
    // 客户电话
    @Prop({ required: true })
    phone: string
    /**
     * 订单状态
     * 0：进行中
     * 1：已完成
     * 2：订单已取消
     */
    @Prop({ required: true ,default :0 })
    state: number
}




export const ProjectOrderSchema = SchemaFactory.createForClass(ProjectOrder);