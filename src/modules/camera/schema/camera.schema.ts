
// 角色表
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CameraDocument = Camera & Document;

@Schema({
    collection: 'camera',
    timestamps: {
        createdAt: 'create_time', 
        updatedAt: 'update_time'
    }
})
export class Camera extends Document {
    // 摄像头名称
    @Prop({ required: true })
    name: string
    // 流量卡号
    @Prop({ required: true })
    iccid: string
    //摄像头编号
    @Prop({ required: true })
    no:number
    // 摄像头拉流地址
    @Prop({ required: true })
    url:string 
    /**
     * 摄像头状态 0为闲置 1为工作 ,2为空闲
     * 摄像头是管理员添加的添加后为0，当给公司分配这个摄像头的时候赋值company_id并将状态改为空闲，当用户将摄像头分配给工单时候则摄像头状态为1
     */
    @Prop({ required: true ,default:0 })
    state:number 
}

export const CameraSchema = SchemaFactory.createForClass(Camera);