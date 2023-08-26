import { Injectable } from '@nestjs/common';
import { CreateProjectOrderCustomerDto } from './dto/create-project_order_customer.dto';
import { UpdateProjectOrderCustomerDto } from './dto/update-project_order_customer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CURD } from 'src/shared/utils/curd.util';

@Injectable()
export class ProjectOrderCustomerService {

  constructor(
    @InjectModel('ProjectOrderCustomer') private readonly projectOrderCustomerSchema: Model<any>,
  ){}
  
  async create(user_id :any ,project_order_id :any) {
    const projectOrder = new this.projectOrderCustomerSchema({user_id ,project_order_id})
    return await projectOrder.save()
  }

  async findOne(dto :any){
    return await this.projectOrderCustomerSchema.findOne(dto)
  }

  async getCustomersByProjectOrderId(project_order_id :string ){
    let id = new Types.ObjectId(project_order_id);
    return await this.projectOrderCustomerSchema.find({ project_order_id :id }).populate('user_id')
  }

  async getPagination(page :number,limit:number ,options ?:object){
    const curd = new CURD(this.projectOrderCustomerSchema)
    return curd.pagination(page ,limit ,options || {});
  }

  async findByIdAndUpdate(id :string,data :object){
    return this.projectOrderCustomerSchema.findByIdAndUpdate(id ,data);
  }

  async remove(id: string) {
    return await this.projectOrderCustomerSchema.findByIdAndRemove(id)
  }

  async findProjectOrdersByUserId(user_id :string ,page :number ,limit :number ,state? :number) {

    page = Number(page);
    limit = Number(limit);
    user_id = user_id;
    state = Number(state)

    let aggregates :any = [
      {
        $match : { user_id :new Types.ObjectId(user_id) ,state : 1 }    // state1,是审核通过的用户
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
          from: "company",
          localField: "project_order_id.company_id",
          foreignField: "_id",
          as: "project_order_id.company_id"
        }
      },
      {
        $unwind: "$project_order_id.company_id"
      },
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

    let result :any = await this.projectOrderCustomerSchema.aggregate(aggregates)
    let rows = result[0].data
    let total = result[0].total || 0;
    return {
      currentPage :page,
      pageSize :limit,
      totalPage: total ? Math.ceil(total / limit) : 1,
      total :total,
      rows :rows
    };
  }

}
