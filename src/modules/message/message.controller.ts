import { Controller, Get, Post, Body, Query, Param, Delete, UseGuards ,Request } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMailMessageDto, CreateMessageDto, CreateSystemMessageDto } from './dto/create-message.dto';
import { ApiBearerAuth, ApiOperation ,ApiQuery, ApiTags } from '@nestjs/swagger';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';

@Controller('api/message')
@ApiTags('消息接口')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
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

  @Get('list_mail')
  @ApiQuery({ name: 'page' ,description:'当前页数'})
  @ApiQuery({ name: 'limit' ,description:'每页数量'})
  @ApiOperation({ summary: '获取所有留言带分页', description: '获取所有留言带分页' }) 
  async findMailMessage(@Query() query){
    try {
      let page = Number(query.page) || 1;
      let limit = Number(query.limit) || 10;
      let conditions = { type : 1 }
      let data =  await this.messageService.findAll(page,limit,{ conditions });
      return apiAmendFormat(data,{
        isTakeResponse :false,
      })
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('recv')
  @ApiQuery({ name: 'page' ,description:'当前页数'})
  @ApiQuery({ name: 'limit' ,description:'每页数量'})
  @ApiQuery({ name: 'state' ,description:'状态'})
  @ApiOperation({ summary: '获取用户消息', description: '获取用户消息，接收方，状态0是未读1是已读' }) 
  async findUserMessage(@Query() query ,@Request() req){
    try {
      let page = Number(query.page) || 1;
      let limit = Number(query.limit) || 10;
      let state = Number(query.state) || -1;
      let recv_user_id = new Types.ObjectId(req.user.id);
      // 接收人ID
      let conditions = { recv_user_id  }
      if(state >= 0){
        conditions = Object.assign(conditions,{ state })
      }
      let data =  await this.messageService.findAll(page,limit,{ conditions ,sort:{ state :1 ,create_time : -1   } });
      return apiAmendFormat(data,{
        isTakeResponse :false,
      })
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('info')
  @ApiQuery({ name: 'id' ,description:'消息ID'})
  @ApiOperation({ summary: '获取消息', description: '获取消息其实是修改了消息的已读状态' }) 
  async findInfoByid(@Query() query){
    try {
      let id = query.id;
      let data =  await this.messageService.findByIdAndUpdate(id,{ state:1 });
      return apiAmendFormat(data)
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('read_all')
  @ApiOperation({ summary: '一键已读', description: '一键已读' }) 
  async readAll(@Request() req){
    try {
      let recv_user_id = req.user.id
      let data =  await this.messageService.readAll(recv_user_id);
      return apiAmendFormat(data)
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('not_read_count')
  @ApiOperation({ summary: '用户未读消息的数量', description: '用户未读消息的数量' }) 
  async getNotReadCount(@Request() req){
    try {
      let recv_user_id = req.user.id
      let data =  await this.messageService.getNotReadCount(recv_user_id);
      return apiAmendFormat(data)
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
