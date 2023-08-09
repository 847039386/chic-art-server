import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageSchema } from './schema/message.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  exports:[
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema  }]),
  ],
  controllers: [MessageController],
  providers: [MessageService],
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
  ]
})
export class MessageModule {}
