import { Controller, Get, Post, Body, Query, Param, Delete } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMailMessageDto, CreateMessageDto, CreateSystemMessageDto } from './dto/create-message.dto';
import { SearchCompanyDto } from './dto/update-message.dto';
import { ApiOperation ,ApiQuery, ApiTags } from '@nestjs/swagger';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';

@Controller('api/message')
@ApiTags('消息接口')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('add_mail')
  @ApiOperation({ summary: '创建一个留言信息', description: '创建留言信息，是用户发送给管理员的' }) 
  async createMailessage(@Body() dto: CreateMailMessageDto) {
    try {
      return apiAmendFormat(await this.messageService.createMailessage(dto))
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Post('list_mail')
  @ApiOperation({ summary: '获取所有留言带分页', description: '获取所有留言带分页' }) 
  async findMailMessage(@Body() dto :SearchCompanyDto){
    try {
      let page = 1;
      let limit = 10;
      page = Number(dto.page) || 1
      limit = Number(dto.limit) || 10
      let conditions = { type : 1}
      let data =  await this.messageService.findAll(page,limit,{ conditions });
      return apiAmendFormat(data,{
        isTakeResponse :false,
      })
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Post('list_user')
  @ApiOperation({ summary: '获取用户消息', description: '获取用户消息，接收方' }) 
  async findUserMessage(@Body() dto :SearchCompanyDto){
    try {
      let page = 1;
      let limit = 10;
      page = Number(dto.page) || 1
      limit = Number(dto.limit) || 10
      let recv_user_id = dto.user_id;
      // 接收人ID
      let conditions = { recv_user_id }
      let data =  await this.messageService.findAll(page,limit,{ conditions });
      return apiAmendFormat(data,{
        isTakeResponse :false,
      })
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Delete('del')
  @ApiQuery({ name: 'id' ,description:'消息ID'})
  @ApiOperation({ summary: '删除消息', description: '根据ID删除消息' }) 
  async remove(@Query('id') id: string) {
    try {
      if(id){
        return apiAmendFormat(await this.messageService.remove(id))
      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }
}
