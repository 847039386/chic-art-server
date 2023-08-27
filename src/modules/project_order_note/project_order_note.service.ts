import { Injectable } from '@nestjs/common';
import { CreateProjectOrderNoteDto } from './dto/create-project_order_note.dto';
import { UpdateProjectOrderNoteDto } from './dto/update-project_order_note.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { CURD } from 'src/shared/utils/curd.util';

@Injectable()
export class ProjectOrderNoteService {

  constructor(
    @InjectModel('ProjectOrder') private readonly projectOrdeSchema: Model<any>,
    @InjectModel('ProjectOrderNote') private readonly projectOrderNoteSchema: Model<any>,
    @InjectModel('ProjectOrderEmployee') private readonly projectOrderEmployeeSchema: Model<any>,
    @InjectModel('ProjectOrderCustomer') private readonly projectOrderCustomerSchema: Model<any>
  ){}

  async create(dto: CreateProjectOrderNoteDto) {
    if(!await this.projectOrdeSchema.findById(dto.project_order_id)){
      throw new BaseException(ResultCode.PROJECT_ORDER_IS_NOT)
    }
    const schema = new this.projectOrderNoteSchema({
      project_order_id:new Types.ObjectId(dto.project_order_id),
      state :dto.state,
      title :dto.title,
      content:dto.content,
    })
    return await schema.save()
  }


  async findEmployee(page,limit ,user_id ,project_order_id){
    project_order_id = new Types.ObjectId(project_order_id);
    let conditions = { project_order_id }
    const por_info = await this.projectOrderEmployeeSchema.findOne({ user_id :new Types.ObjectId(user_id) ,project_order_id })
    if(!por_info){
      // 与该订单无关系
      throw new BaseException(ResultCode.COMPANY_EMPLOYEE_IS_NOT)
    }

    const po_info = await this.projectOrdeSchema.findById(project_order_id);

    if(!po_info){
      throw new BaseException(ResultCode.PROJECT_ORDER_IS_NOT)
    }

    if(user_id != po_info.user_id){
      conditions = Object.assign(conditions ,{ state:{ $in:[0,2] } })
    }

    console.log(user_id == po_info.user_id ,user_id , po_info.user_id)

    const curd = new CURD(this.projectOrderNoteSchema)
    return curd.pagination(page,limit, { conditions  });
  }

  async findCustomer(page,limit ,project_order_id){

    project_order_id = new Types.ObjectId(project_order_id);
    let conditions = { project_order_id ,state:{ $in:[0,3] } }

    const curd = new CURD(this.projectOrderNoteSchema)
    return curd.pagination(page,limit, { conditions  });
  }


  async remove(id: string) {
    return await this.projectOrderNoteSchema.findByIdAndRemove(id);
  }

}
