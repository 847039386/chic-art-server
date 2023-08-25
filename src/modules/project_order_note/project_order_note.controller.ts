import { Controller, Get, Post, Body, Patch, Param, Delete ,Request, UseGuards, Query } from '@nestjs/common';
import { ProjectOrderNoteService } from './project_order_note.service';
import { CreateProjectOrderNoteDto } from './dto/create-project_order_note.dto';
import { UpdateProjectOrderNoteDto } from './dto/update-project_order_note.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/project-order-note')
@ApiTags('订单笔记')
export class ProjectOrderNoteController {
  constructor(private readonly projectOrderNoteService: ProjectOrderNoteService) {}

  @Post('add')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '根据项目订单ID添加客户', description: '根据项目订单ID添加客户' }) 
  async create(@Body() dto: CreateProjectOrderNoteDto ,@Request() req) {
    try {

      let titlePattern = /^.{1,12}$/;
      if(!dto.title || !titlePattern.test(dto.title)){
        throw new BaseException(ResultCode.PROJECT_ORDER_NOTE_TITLE_VERIFY,{})
      }

      let contentPattern = /^.{1,3000}$/;
      if(!dto.content|| !contentPattern.test(dto.content)){
        throw new BaseException(ResultCode.PROJECT_ORDER_NOTE_CONTENT_VERIFY,{})
      }

      let result = await this.projectOrderNoteService.create(dto);
      return apiAmendFormat(result)
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('list_by_employee')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'page' ,description:'当前页数' ,required :false})
  @ApiQuery({ name: 'limit' ,description:'每页数量' ,required :false})
  @ApiQuery({ name: 'project_order_id' ,description:'订单ID' })
  @ApiOperation({ summary: '根据ID查看工程订单详细信息', description: '根据ID查看工程订单详细信息' }) 
  async findEmployeeNote(@Query() query ,@Request() req) {
    try {
      let page = 1;
      let limit = 10;
      let user_id = req.user.id;
      let project_order_id = query.project_order_id;
      page = Number(query.page) || 1;
      limit = Number(query.limit) || 10;
      if(!project_order_id){
        throw new BaseException(ResultCode.PROJECT_ORDER_IS_NOT)
      }
      return apiAmendFormat(await this.projectOrderNoteService.findEmployee(page,limit,user_id,project_order_id))
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  

  @Delete('del')
  @ApiQuery({ name: 'id' ,description:'笔记ID'})
  @ApiOperation({ summary: '删除项目笔记', description: '根据id删除项目笔记' }) 
  async remove(@Query('id') id: string) {
    try {
      if(id){
        return apiAmendFormat(await this.projectOrderNoteService.remove(id))
      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }
}
