import { Injectable } from '@nestjs/common';
import { CreateProjectOrderDto } from './dto/create-project_order.dto';
import { UpdateProjectOrderDto } from './dto/update-project_order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CURD } from 'src/shared/utils/curd.util';

@Injectable()
export class ProjectOrderService {

  constructor(
    @InjectModel('ProjectOrder') private readonly projectOrderSchema: Model<CreateProjectOrderDto>,
  ){}

  create(dto: CreateProjectOrderDto) {
    return 'This action adds a new projectOrder';
  }

  async findAll(page :number ,limit :number ,options ? :object) {
    const curd = new CURD(this.projectOrderSchema)
    return curd.pagination(page,limit,options || {});
  }

  findOne(id: number) {
    return `This action returns a #${id} projectOrder`;
  }

  update(id: number, updateProjectOrderDto: UpdateProjectOrderDto) {
    return `This action updates a #${id} projectOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectOrder`;
  }
}
