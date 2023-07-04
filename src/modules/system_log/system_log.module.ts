import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemLogService } from './system_log.service';
import { SystemLogController } from './system_log.controller';
import { SystemLogSchema } from './schema/system_log.schema'


@Module({
  controllers: [SystemLogController],
  providers: [SystemLogService],
  imports: [
    MongooseModule.forFeature([{ name: 'SystemLog', schema: SystemLogSchema ,collection:'system_log' }]),
  ]
})
export class SystemLogModule {}
