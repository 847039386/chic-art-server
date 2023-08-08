import { Injectable } from '@nestjs/common';
import { CreateProjectOrderUserDto ,CreateProjectOrderClientDto } from './dto/create-project_order_user.dto';
import { UpdateProjectOrderUserDto } from './dto/update-project_order_user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class ProjectOrderUserService {
  constructor(
    @InjectModel('ProjectOrderUser') private readonly projectOrderUserSchema: Model<CreateProjectOrderUserDto>,
  ){}

  
  async create(dto: CreateProjectOrderUserDto) {
    let newSchema = []
    dto.user_ids.forEach((element) => {
      newSchema.push({ 
        identity_type:0,
        state:1,
        project_order_id :dto.project_order_id ,
        user_id :element })
    })
    return await this.projectOrderUserSchema.insertMany(newSchema)
  }

  async findAllByProjectOrderId(project_order_id :string) {
    return await this.projectOrderUserSchema.find({project_order_id});
  }

  async remove(id: string) {
    return await this.projectOrderUserSchema.findByIdAndRemove(id)
  }

  // 添加用户，一般都是用户扫码添加过来所以
  async addClient(dto :CreateProjectOrderClientDto){
    // 添加员工时候状态为0需要审核，拒绝后直接删除
    const projectOrderUser = new this.projectOrderUserSchema({
      user_id: new Types.ObjectId(dto.user_id),
      project_order_id: new Types.ObjectId(dto.project_order_id),
      identity_type: 1, 
      state:0 
    })
    return await projectOrderUser.save()
  }



}
