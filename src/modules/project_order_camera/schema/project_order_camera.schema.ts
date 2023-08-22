
// 角色表
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProjectOrder } from 'src/modules/project_order/schema/project_order.schema'
import { Document, Types } from 'mongoose';
import { CompanyCamera } from 'src/modules/company_camera/schema/company_camera.schema';
import { Camera } from 'src/modules/camera/schema/camera.schema';

export type ProjectOrderCameraDocument = ProjectOrderCamera & Document;

@Schema({
    collection: 'project_order_camera',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    }
})
export class ProjectOrderCamera extends Document {
    //别名
    @Prop({ required:true ,default:'监控'})
    name:string
    // 摄像头ID
    @Prop({ type: Types.ObjectId, ref: 'Camera' ,required:true })
    camera_id: Camera
    // 摄像头公司关系ID
    @Prop({ type: Types.ObjectId, ref: 'CompanyCamera' ,required:true })
    company_camera_id: CompanyCamera
    // 工程订单ID,
    @Prop({ type: Types.ObjectId, ref: 'ProjectOrder' ,required:true })
    project_order_id: ProjectOrder
    /**
     * 工程订单监控状态
     * 0：允许客户查看
     * 1：拒绝客户查看
     */
    @Prop({ type: Number ,required:true ,default: 0 })
    state: number


}

export const ProjectOrderCameraSchema = SchemaFactory.createForClass(ProjectOrderCamera);