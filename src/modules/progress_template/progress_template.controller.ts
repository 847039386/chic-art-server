import { Controller, Get, Post, Body, Query, Delete, Patch } from '@nestjs/common';
import { ProgressTemplateService } from './progress_template.service';
import { CreateProgressTemplateDto } from './dto/create-progress_template.dto';
import { UpdateProgressTemplateDto } from './dto/update-progress_template.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';

@Controller('api/progress-template')
@ApiTags('进度模板接口')
export class ProgressTemplateController {
  constructor(private readonly progressTemplateService: ProgressTemplateService) {}

  @Post('add')
  @ApiOperation({ summary: '添加进度模板', description: '添加进度模板' }) 
  async create(@Body() dto: CreateProgressTemplateDto) {
    try {
      if(dto.name && dto.template.length > 0){
        return apiAmendFormat(await this.progressTemplateService.create(dto))
      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('up_info')
  @ApiOperation({ summary: '修改进度模板', description: '修改进度模板' }) 
  async updateInfo(@Body() dto: UpdateProgressTemplateDto) {
    try {
      if(dto.id && dto.name && dto.template.length > 0){
        return apiAmendFormat(await this.progressTemplateService.updateInfo(dto))
      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('list')
  @ApiOperation({ summary: '进度模板列表无分页', description: '进度模板列表无分页' }) 
  async findAll() {
    return apiAmendFormat(await this.progressTemplateService.findAll())
  }

  @Delete('del')
  @ApiQuery({ name: 'id' ,description:'进度模板ID'})
  @ApiOperation({ summary: '删除进度模板', description: '根据id删除进度模板' }) 
  async remove(@Query('id') id: string) {
    try {
      if(id){
        return apiAmendFormat(await this.progressTemplateService.remove(id))
      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }
}
