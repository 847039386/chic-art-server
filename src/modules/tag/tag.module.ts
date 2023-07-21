import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TagSchema } from './schema/tag.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [TagController],
  providers: [TagService],
  imports: [
    MongooseModule.forFeature([{ name: 'Tag', schema: TagSchema }]),
  ]
})
export class TagModule {}
