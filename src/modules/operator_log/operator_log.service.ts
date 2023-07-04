import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CreateOperatorLogDto } from './dto/create-operator_log.dto';
import { UpdateOperatorLogDto } from './dto/update-operator_log.dto';
import { CURD } from 'src/shared/utils/curd.util';



@Injectable()
export class OperatorLogService {

  constructor(@InjectModel('OperatorLog') private readonly operatorLogSchema: Model<CreateOperatorLogDto>) { }

  async create(createOperatorLogDto: CreateOperatorLogDto) {
    const operatorLog = new this.operatorLogSchema(createOperatorLogDto)
    return await operatorLog.save();
  }

  findAll(page :number ,limit :number) {
    const curd = new CURD<CreateOperatorLogDto>(this.operatorLogSchema)
    return curd.pagination(page,limit,{ populate:'user_id' });
  }

  async cleared() : Promise<any> {
    return await this.operatorLogSchema.deleteMany({})
  }
  

}
