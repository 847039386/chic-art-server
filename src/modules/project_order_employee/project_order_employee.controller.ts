import { Controller, Get, Post, Body, Patch, Param, Delete, Query ,Request,UseGuards } from '@nestjs/common';
import { ProjectOrderEmployeeService } from './project_order_employee.service';
import { CreateProjectOrderEmployeeDto } from './dto/create-project_order_employee.dto';
import { UpdateProjectOrderEmployeeDto } from './dto/update-project_order_employee.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { Types } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/project-order-employee')
@ApiTags('项目订单公司员工接口')
export class ProjectOrderEmployeeController {
  constructor(
    private readonly projectOrderEmployeeService: ProjectOrderEmployeeService,
  ){}


  @Get('project_order_list')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'page' ,description:'当前页数' ,required :false})
  @ApiQuery({ name: 'limit' ,description:'每页数量' ,required :false})
  @ApiQuery({ name: 'state' ,description:'状态：可不填，不填则是全部跟用户有关系的订单' ,required :false})
  @ApiOperation({ summary: '根据ID查看工程订单详细信息', description: '根据ID查看工程订单详细信息' }) 
  async findProjectOrdersByUserId(@Query() query ,@Request() req) {
    try {
      let page = 1;
      let limit = 10;
      let state = Number(query.state)
      let req_user_id = req.user.id;
      page = Number(query.page) || 1;
      limit = Number(query.limit) || 10;
      if(isNaN(state)){
        return apiAmendFormat(await this.projectOrderEmployeeService.findAll(req_user_id ,page ,limit))
      }else{
        return apiAmendFormat(await this.projectOrderEmployeeService.findAll(req_user_id ,page ,limit ,state))
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('employee_list')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'project_order_id' ,description:'项目订单'})
  @ApiOperation({ summary: '根据项目订单查看所有与订单绑定的员工', description: '根据项目订单查看所有与订单绑定的员工' }) 
  async findByProjectOrderId(@Query('project_order_id') project_order_id :string) {
    try {
      if(project_order_id){
        return apiAmendFormat(await this.projectOrderEmployeeService.findByProjectOrderId(project_order_id))
      }else{
        throw new BaseException(ResultCode.ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Post('add')
  @ApiOperation({ summary: '根据项目订单ID添加员工', description: '根据项目订单ID添加员工' }) 
  async create(@Body() dto: CreateProjectOrderEmployeeDto ,@Request() req) {
    try {
      let result = await this.projectOrderEmployeeService.create(dto);
      return apiAmendFormat(result)
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('up_visible_state')
  @ApiQuery({ name: 'id' ,description:'工程订单ID'})
  @ApiQuery({ name: 'visible_state' ,description:'可见状态'})
  @ApiOperation({ summary: '修改订单员工的可见状态', description: '主要针对客户是否可见' }) 
  async updateInfoVisibleState(@Query() query) {
    try {
      const id = query.id;
      let visible_state = Number(query.visible_state);
      if(!id){
        throw new BaseException(ResultCode.PROJECT_ORDER_EMPLOYEE_IS_NOT,{})
      }

      if(isNaN(visible_state)){
        visible_state = 0
      }
      
      return apiAmendFormat(await this.projectOrderEmployeeService.updateById(id,{ visible_state }))

    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }



  @Delete('del')
  @ApiQuery({ name: 'id' ,description:'订单员工表ID'})
  @ApiOperation({ summary: '删除订单员工', description: '删除订单员工' }) 
  async remove(@Query('id') id: string) {
    try {
      if(id){
        const poe = await this.projectOrderEmployeeService.findById(id);

        if(!poe){
          throw new BaseException(ResultCode.PROJECT_ORDER_EMPLOYEE_IS_NOT,{})
        }

        if(!poe.company_employee_id){
          throw new BaseException(ResultCode.PROJECT_ORDER_EMPLOYEE_DEL_ERROR,{})
        }

        return apiAmendFormat(await this.projectOrderEmployeeService.remove(id))
      }else{
        throw new BaseException(ResultCode.PROJECT_ORDER_EMPLOYEE_IS_NOT,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  



}
