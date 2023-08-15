import { Injectable } from '@nestjs/common';
import { CreateProjectOrderCameraDto } from './dto/create-project_order_camera.dto';
import { UpdateProjectOrderCameraDto } from './dto/update-project_order_camera.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class ProjectOrderCameraService {

  constructor(
    @InjectModel('ProjectOrderCamera') private readonly projectOrderCameraSchema: Model<any>,
  ){}

  async create(dto: CreateProjectOrderCameraDto) {
    const projectOrderCamera = new this.projectOrderCameraSchema({
      camera_id: new Types.ObjectId(dto.camera_id),
      project_order_id: new Types.ObjectId(dto.project_order_id)
    })
    return await projectOrderCamera.save()
  }

  async findByProjectOrderId(project_order_id :string) {
    return await this.projectOrderCameraSchema.find({ project_order_id :new Types.ObjectId(project_order_id) }).populate('camera_id');
  }

  async remove(id: string) {
    return await this.projectOrderCameraSchema.findByIdAndRemove(id);
  }

  async findOne(query){
    return await this.projectOrderCameraSchema.findOne(query);
  }
}
