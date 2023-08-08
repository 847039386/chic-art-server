import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProjectOrderUserService } from './project_order_user.service';
import { CreateProjectOrderClientDto, CreateProjectOrderUserDto } from './dto/create-project_order_user.dto';
import { UpdateProjectOrderUserDto } from './dto/update-project_order_user.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';

@Controller('api/project-order-user')
@ApiTags('工程订单用户')
export class ProjectOrderUserController {
  constructor(private readonly projectOrderUserService: ProjectOrderUserService) {}

  @Post('add_employees')
  @ApiOperation({ summary: '给工程订单批量添加员工', description: '给工程订单批量添加员工' }) 
  async create(@Body() dto: CreateProjectOrderUserDto) {
    try {
      if(dto.user_ids.length > 0 && dto.project_order_id){
        return apiAmendFormat(await this.projectOrderUserService.create(dto))
      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Post('add_client')
  @ApiOperation({ summary: '添加客户', description: '客户扫码添加需审核' }) 
  async addClient(@Body() dto: CreateProjectOrderClientDto) {
    try {
      if(dto.user_id && dto.project_order_id){
        return apiAmendFormat(await this.projectOrderUserService.addClient(dto))
      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('list_by_project_order')
  @ApiQuery({ name: 'project_order_id' ,description:'工程订单ID'})
  @ApiOperation({ summary: '获取工程订单的用户', description: '根据工程订单ID获取所有的用户，包括员工与客户' }) 
  async findAll(@Query('project_order_id') project_order_id: string) {
    try {
      if(project_order_id){
        return apiAmendFormat(await this.projectOrderUserService.findAllByProjectOrderId(project_order_id))
      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }
  

  // 当公司管理员拒绝用户进入订单时，可以调用该API删除这条关系
  @Delete('del')
  @ApiQuery({ name: 'id' ,description:'项目订单与用户关系ID'})
  @ApiOperation({ summary: '断联项目订单的用户关系', description: '根据id断联工程订单与用户之间的关系' }) 
  async remove(@Query('id') id: string) {
    try {
      if(id){
        return apiAmendFormat(await this.projectOrderUserService.remove(id))
      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }
}
