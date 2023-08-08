import { Injectable } from '@nestjs/common';
import { CreateMailMessageDto, CreateMessageDto, CreateSystemMessageDto } from './dto/create-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CURD } from 'src/shared/utils/curd.util';

@Injectable()
export class MessageService {

  constructor(
    @InjectModel('Message') private readonly messageSchema: Model<CreateMessageDto>,
  ){}

  // 创建系统消息
  async createSystemMessage(dto: CreateSystemMessageDto) {
    const message = new this.messageSchema(dto)
    return await message.save()
  }

  // 创建留言消息
  async createMailessage(dto: CreateMailMessageDto) {
    const message = new this.messageSchema(dto)
    return await message.save()
  }


  findAll(page :number ,limit :number ,options ? :object) {
    const curd = new CURD(this.messageSchema)
    return curd.pagination(page,limit,options || {});
  }

  async remove(id: string) {
    return await this.messageSchema.findByIdAndRemove(id)
  }

}
