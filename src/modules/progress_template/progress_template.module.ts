import { Module } from '@nestjs/common';
import { ProgressTemplateService } from './progress_template.service';
import { ProgressTemplateController } from './progress_template.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgressTemplateSchema } from './schema/progress_template.schema';

@Module({
  controllers: [ProgressTemplateController],
  providers: [ProgressTemplateService],
  imports: [
    MongooseModule.forFeature([{ name: 'ProgressTemplate', schema: ProgressTemplateSchema }]),
  ]
})
export class ProgressTemplateModule {}
