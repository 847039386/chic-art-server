
// 角色表
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProjectOrder } from 'src/modules/project_order/schema/project_order.schema'
import { Document, Types } from 'mongoose';
import { Camera } from 'src/modules/camera/schema/camera.schema';
import { Company } from 'src/modules/company/schema/company.schema';

export type CompanyCameraDocument = CompanyCamera & Document;

@Schema({
    collection: 'company_camera',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    }
})
export class CompanyCamera extends Document {
    // 摄像头ID
    @Prop({ type: Types.ObjectId, ref: 'Camera' ,required:true })
    camera_id: Camera
    // 公司ID
    @Prop({ type: Types.ObjectId, ref: 'Company' ,required:true })
    company_id: Company
    // 到期时间,
    @Prop({ type: Date, required: true, default:Date.now() })
    expire_time: Date

}

export const CompanyCameraSchema = SchemaFactory.createForClass(CompanyCamera);