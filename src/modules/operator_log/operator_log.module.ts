import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OperatorLogService } from './operator_log.service';
import { OperatorLogController } from './operator_log.controller';
import { OperatorLogSchema } from './schema/operator_log.schema';

@Module({
  controllers: [OperatorLogController],
  providers: [OperatorLogService],
  imports: [
    MongooseModule.forFeature([{ name: 'OperatorLog', schema: OperatorLogSchema }]),
  ]
})

export class OperatorLogModule {}
