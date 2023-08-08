
// 角色表
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/modules/user/schema/user.schema'
import { ProjectOrder } from 'src/modules/project_order/schema/project_order.schema'
import { Document, Types } from 'mongoose';

export type ProjectOrderUserDocument = ProjectOrderUser & Document;

@Schema({
    collection: 'project_order_user',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    }
})
export class ProjectOrderUser extends Document {
    // 员工ID
    @Prop({ type: Types.ObjectId, ref: 'User' ,required:true })
    user_id: User
    // 工程订单ID,
    @Prop({ type: Types.ObjectId, ref: 'Company' ,required:true })
    project_order_id: ProjectOrder
    /**
     * 身份
     * 0：员工
     * 1：客户
     */
    @Prop({ required: true })
    identity_type: number
    /**
     * 状态
     * 0：待审核
     * 1：审核通过
     * 为了保证用户扫码后不能直接绑定该订单这里需要管理员审核一下，当批量添加员工的时候直接将状态变为1不需要审核
     */
    @Prop({ required: true })
    state :number

}

export const ProjectOrderUserSchema = SchemaFactory.createForClass(ProjectOrderUser);