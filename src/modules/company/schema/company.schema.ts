
// 角色表
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/user/schema/user.schema'
import { Tag } from 'src/modules/tag/schema/tag.schema'; 

export type CompanyDocument = Company & Document;

@Schema({
    collection: 'company',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    }
})
export class Company extends Document {
    // Logo图片地址,
    @Prop({ type:String, ref: 'User' })
    logo: string
    // 公司创始人,
    @Prop({ type: Types.ObjectId, ref: 'User' ,required:true })
    user_id: User
    // 公司创始人,
    @Prop({ type: [Types.ObjectId], ref: 'Tag' })
    tag_ids: [Tag]
    // 公司名称
    @Prop({ required: true })
    name: string
    // 公司描述
    @Prop({ required: true })
    description: string
    // 权重
    @Prop({ required: true ,default :0 })
    weight: number
    // 状态 0正常，1封禁
    @Prop({ required: true ,default :0 })
    state: number
    /**
     * 审核状态 0正常，1待审核，2审核不通过
     * 审核后该变量为0
     * 如果不允许通过的话，逻辑将此变量改成2，用户还可以继续更改公司信息
     */
    @Prop({ required: true ,default :1 })
    audit_state: number
    // 标签数组多个
    @Prop({  })
    tags: string
}

export const CompanySchema = SchemaFactory.createForClass(Company);