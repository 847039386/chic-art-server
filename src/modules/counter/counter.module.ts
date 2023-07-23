import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CounterSchema } from './schema/counter.schema';

@Module({
  exports:[
    MongooseModule.forFeature([{ name: 'Counter', schema: CounterSchema  }]),
  ],
  imports: [
    MongooseModule.forFeature([{ name: 'Counter', schema: CounterSchema  }]),
  ]
})
export class CounterModule {}
 