import { Injectable } from '@nestjs/common';
import { CreateProjectOrderEmployeeDto } from './dto/create-project_order_employee.dto';
import { UpdateProjectOrderEmployeeDto } from './dto/update-project_order_employee.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CURD } from 'src/shared/utils/curd.util';

@Injectable()
export class ProjectOrderEmployeeService {

  constructor(
    @InjectModel('ProjectOrderEmployee') private readonly projectOrderEmployeeSchema: Model<any>,
  ){}


 
  async findByProjectOrderId(project_order_id :string) {
    return await this.projectOrderEmployeeSchema.find({ project_order_id :new Types.ObjectId(project_order_id)}).populate('project_order_id')
  }

  
  // async findAll(page :number ,limit :number ,options ? :object) {
  //   const curd = new CURD(this.projectOrderEmployeeSchema)
  //   return curd.pagination(page,limit,options || {});
  // }

  async findAll(user_id :string ,page :number ,limit :number ,state? :number) {

    page = Number(page);
    limit = Number(limit);
    user_id = user_id;
    state = Number(state)

    let aggregates :any = [
      {
        $match : { user_id :new Types.ObjectId(user_id) }
      },
      {
        $lookup: {
          from: "project_order",
          localField: "project_order_id",
          foreignField: "_id",
          as: "project_order_id"
        }
      },
      {
        $unwind: "$project_order_id"
      },
    ]
    if(!isNaN(state)){
      aggregates.push({
        $match : { 'project_order_id.state' : state }
      })
    }

    aggregates = aggregates.concat([
      {
        $lookup: {
          from: "user",
          localField: "project_order_id.user_id",
          foreignField: "_id",
          as: "project_order_id.user_id"
        }
      },
      {
        $unwind: "$project_order_id.user_id"
      },
      {
        $facet :{
          total: [{ $count:"count" }],
          rows:[
            { $skip:(page - 1) * limit },
            { $limit: limit} ,
            {$sort :{ "create_time": 1 }}
          ]
        }
      },
      {
        $project: {
            data:'$rows',
            total: {$arrayElemAt: [ "$total.count", 0 ]},
            
        }
      },
    ])


    let result :any = await this.projectOrderEmployeeSchema.aggregate(aggregates)
    let rows = result[0].data
    let total = result[0].total;
    return {
      currentPage :page,
      pageSize :limit,
      totalPage: total ? Math.ceil(total / limit) : 1,
      total :total,
      rows :rows
    };
  }

}
