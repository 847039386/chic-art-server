import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { IApiPagination } from 'src/shared/interfaces/api_spec.interface'
import { CreateRequestLogDto } from './dto/create-request_log.dto';
import { CURD } from 'src/shared/utils/curd.util'

@Injectable()
export class RequestLogService {

  constructor(@InjectModel('RequestLog') private readonly requestLogSchema: Model<CreateRequestLogDto>) { }

  async create(createRequestLogDto: CreateRequestLogDto) {
    const requestLog = new this.requestLogSchema(createRequestLogDto)
    return await requestLog.save();
  }

  findAll(page :number ,limit :number) : Promise<IApiPagination> {
    const curd = new CURD<CreateRequestLogDto>(this.requestLogSchema)
    return curd.pagination(page,limit);
  }

  async cleared() : Promise<any> {
    return await this.requestLogSchema.deleteMany({})
  }
  
}
