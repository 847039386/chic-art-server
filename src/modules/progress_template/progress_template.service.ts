import { Injectable } from '@nestjs/common';
import { CreateProgressTemplateDto } from './dto/create-progress_template.dto';
import { UpdateProgressTemplateDto } from './dto/update-progress_template.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProgressTemplateService {

  constructor(
    @InjectModel('ProgressTemplate') private readonly progressTemplateSchema: Model<CreateProgressTemplateDto>,
  ){}

  
  async create(dto: CreateProgressTemplateDto) {
    const progressTemplate = new this.progressTemplateSchema(dto)
    return await progressTemplate.save()
  }

  async findAll() {
    return await this.progressTemplateSchema.find({})
  }


  async updateInfo(dto: UpdateProgressTemplateDto) {
    return await this.progressTemplateSchema.findByIdAndUpdate(dto.id,{
      name :dto.name,
      template :dto.template
    })
  }

  async remove(id: string) {
    return await this.progressTemplateSchema.findByIdAndRemove(id)
  }
}
