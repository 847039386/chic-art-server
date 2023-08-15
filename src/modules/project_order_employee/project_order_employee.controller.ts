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
  constructor(private readonly projectOrderEmployeeService: ProjectOrderEmployeeService) {}


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

}
