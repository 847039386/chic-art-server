
// 角色表
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CompanyEmployee } from 'src/modules/company_employee/schema/company_employee.schema'
import { ProjectOrder } from 'src/modules/project_order/schema/project_order.schema'
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/user/schema/user.schema';

export type ProjectOrderCustomerDocument = ProjectOrderCustomer & Document;

@Schema({
    collection: 'project_order_customer',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    }
})
export class ProjectOrderCustomer extends Document {
    // 用户ID，根据这个id来查找用户对应的订单
    @Prop({ type: Types.ObjectId, ref: 'User' ,required:true })
    user_id: User
    @Prop({ type: Types.ObjectId, ref: 'ProjectOrder' ,required:true })
    project_order_id: ProjectOrder
    /**
     * 状态，用户加入订单后需要管理员审核。
     * 0：审核中
     * 1：正常
     */
    @Prop({ required: true ,default:0 })
    state: number

}

export const ProjectOrderCustomerSchema = SchemaFactory.createForClass(ProjectOrderCustomer);