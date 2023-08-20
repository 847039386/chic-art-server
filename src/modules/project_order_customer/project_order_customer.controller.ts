import { Controller, Get, Post, Body, Query, Delete , Patch ,Request, UseGuards } from '@nestjs/common';
import { ProjectOrderCustomerService } from './project_order_customer.service';
import { CreateProjectOrderCustomerDto } from './dto/create-project_order_customer.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';

@Controller('api/project-order-customer')
@ApiTags('客户与项目订单关系接口')
export class ProjectOrderCustomerController {
  constructor(private readonly projectOrderCustomerService: ProjectOrderCustomerService) {}

  @Post('add')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '根据项目订单ID添加客户', description: '根据项目订单ID添加客户' }) 
  async create(@Body() dto: CreateProjectOrderCustomerDto ,@Request() req) {
    try {
      let req_user_id = new Types.ObjectId(req.user.id);
      let project_order_id = new Types.ObjectId(dto.project_order_id)
      let poi = await this.projectOrderCustomerService.findOne({ req_user_id,project_order_id })
      if(!poi){
        let result = await this.projectOrderCustomerService.create(req_user_id,project_order_id);
        return apiAmendFormat(result)
      }else{
        if(poi.state == 0){
          throw new BaseException(ResultCode.PROJECT_ORDER_CUSTOMER_IS_EXIST_AUDIT,{})
        }else{
          throw new BaseException(ResultCode.PROJECT_ORDER_CUSTOMER_IS_EXIST,{})
        }
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('list_by_projectorderid')
  @ApiQuery({ name: 'project_order_id' ,description:'工程订单ID'})
  @ApiOperation({ summary: '根据项目订单ID获取该订单所有客户', description: '根据项目订单ID获取该订单所有客户' }) 
  async getCustomersByProjectOrderId(@Query('project_order_id') project_order_id: string){
    try {
      let data =  await this.projectOrderCustomerService.getCustomersByProjectOrderId(project_order_id);
      return apiAmendFormat(data,{
        isTakeResponse :false,
      })
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('list_by_userid')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'state' ,description:'订单状态' ,required:false})
  @ApiQuery({ name: 'page' ,description:'当前页数' ,required:false})
  @ApiQuery({ name: 'limit' ,description:'每页数量' ,required:false})
  @ApiOperation({ summary: '根据用户ID获取用户所有项目订单', description: '根据用户ID获取用户所有项目订单，带分页' }) 
  async getAllbyUserId(@Query() query ,@Request() req){
    try {
      let page = 1;
      let limit = 10;
      let state = Number(query.state)
      let req_user_id = req.user.id;
      page = Number(query.page) || 1;
      limit = Number(query.limit) || 10;
      if(isNaN(state)){
        return apiAmendFormat(await this.projectOrderCustomerService.findProjectOrdersByUserId(req_user_id,page,limit))
      }else{
        return apiAmendFormat(await this.projectOrderCustomerService.findProjectOrdersByUserId(req_user_id,page,limit,state))
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('audit_ok')
  @ApiQuery({ name: 'id' ,description:'项目订单客户关系表ID'})
  @ApiOperation({ summary: '客户申请加入订单允许', description: '客户申请加入订单允许' }) 
  async auditEmployee(@Query('id') id: string){
    try {
      if(id){
        return apiAmendFormat(await this.projectOrderCustomerService.findByIdAndUpdate(id,{ state :1 }))
      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Delete('del')
  @ApiQuery({ name: 'id' ,description:'公司员工关系表ID'})
  @ApiOperation({ summary: '根据ID切断项目订单与客户的关系', description: '根据ID切断项目订单与客户的关系，审核拒绝后也调用此方法' }) 
  async remove(@Query('id') id: string) {
    try {
      if(id){
        return apiAmendFormat(await this.projectOrderCustomerService.remove(id))
      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }





}
