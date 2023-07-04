import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSystemLogDto } from './dto/create-system_log.dto';


@Injectable()
export class SystemLogService {

  constructor(@InjectModel('SystemLog') private readonly systemLogSchema: Model<CreateSystemLogDto>) { }

  async create(createSystemLogDto: CreateSystemLogDto) {
    const systemLog = new this.systemLogSchema(createSystemLogDto)
    return await systemLog.save();
  }

  findAll() {
    return `This action returns all systemLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} systemLog`;
  }
}
 