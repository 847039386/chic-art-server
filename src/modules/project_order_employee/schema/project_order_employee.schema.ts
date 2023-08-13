
// 角色表
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CompanyEmployee } from 'src/modules/company_employee/schema/company_employee.schema'
import { ProjectOrder } from 'src/modules/project_order/schema/project_order.schema'
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/user/schema/user.schema';

export type ProjectOrderEmployeeDocument = ProjectOrderEmployee & Document;

@Schema({
    collection: 'project_order_employee',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    }
})
export class ProjectOrderEmployee extends Document {
    // 用户ID，根据这个id来查找用户对应的订单
    @Prop({ type: Types.ObjectId, ref: 'User' ,required:true })
    user_id: User
    // 公司员工表ID
    @Prop({ type: Types.ObjectId, ref: 'CompanyEmployee' })
    company_employee_id: CompanyEmployee
    // 工程订单ID,
    @Prop({ type: Types.ObjectId, ref: 'ProjectOrder' ,required:true })
    project_order_id: ProjectOrder

}

export const ProjectOrderEmployeeSchema = SchemaFactory.createForClass(ProjectOrderEmployee);