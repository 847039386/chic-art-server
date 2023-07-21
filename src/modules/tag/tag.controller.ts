import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiOperation, ApiQuery ,ApiTags } from '@nestjs/swagger';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { apiAmendFormat } from 'src/shared/utils/api.util';

@Controller('api/tag')
@ApiTags('标签接口') 
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post('add')
  @ApiOperation({ summary: '添加标签', description: '添加标签' }) 
  async create(@Body() body: CreateTagDto) {
    try {
      if(!body.name){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      if(await this.tagService.isExist(body.name)){
        throw new BaseException(ResultCode.TAG_IS_EXIST,{})
      }
      return apiAmendFormat(await this.tagService.create(body));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('list')
  @ApiOperation({ summary: '标签列表', description: '标签列表不分页' })
  async findAll() {
    try {
      return apiAmendFormat(await this.tagService.findAll())
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('up_info')
  @ApiOperation({ summary: '修改标签信息', description: '根据标签id修改标签信息' }) 
  async updateInfo(@Body() body: UpdateTagDto) {
    try {
      if(body.id && body.name){
        if(await this.tagService.isExist(body.name)){
          throw new BaseException(ResultCode.TAG_IS_EXIST,{})
        }
        return apiAmendFormat(await this.tagService.updateInfo(body))
      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Delete('del')
  @ApiQuery({ name: 'id' ,description:'标签ID'})
  @ApiOperation({ summary: '删除标签', description: '根据id删除标签' }) 
  async remove(@Query('id') id: string) {
    try {
      if(id){
        return apiAmendFormat(await this.tagService.remove(id))
      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }
 
}
