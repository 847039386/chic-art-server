
// 角色表
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/modules/user/schema/user.schema'
import { Company } from 'src/modules/company/schema/company.schema'
import { Document, Types } from 'mongoose';

export type CompanyEmployeeDocument = CompanyEmployee & Document;

@Schema({
    collection: 'company_employee',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    }
})
export class CompanyEmployee extends Document {
    // 员工ID,
    @Prop({ type: Types.ObjectId, ref: 'User' ,required:true })
    user_id: User
    // 公司ID,
    @Prop({ type: Types.ObjectId, ref: 'Company' ,required:true })
    company_id: Company
    /**
     * 身份
     * 0：普通员工
     * 1：管理，公司管理由创始人更改，管理人可以创建订单分配订单工人
     * 2：公司创始人
     */
    @Prop({ required: true ,default :0 })
    identity_type: number
    // 分组名称
    @Prop({ required: true ,default :'默认分组' })
    group_name :string
    // 员工备注
    @Prop({ required: true ,default :'普通员工' })
    remark :string
    /**
     * 审核状态 0待审核，1审核通过，
     * 审核后该变量为0
     * 如果不允许通过的话，逻辑将此变量改成2，用户还可以继续更改公司信息
     */
    @Prop({ required: true ,default :0 })
    audit_state: number
}

export const CompanyEmployeeSchema = SchemaFactory.createForClass(CompanyEmployee);