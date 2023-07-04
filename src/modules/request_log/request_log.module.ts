import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestLogService } from './request_log.service';
import { RequestLogController } from './request_log.controller';
import { RequestLogSchema } from './schema/request_log.schema'
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [RequestLogController],
  providers: [RequestLogService],
  imports: [
    MongooseModule.forFeature([{ name: 'RequestLog', schema: RequestLogSchema }]),
  ]
})
export class RequestLogModule {}
