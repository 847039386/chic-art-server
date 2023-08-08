import { Controller, Get, Post, Body, Patch, Param, Delete ,Query } from '@nestjs/common';
import { ProjectOrderService } from './project_order.service';
import { CreateProjectOrderDto, ProjectOrderListAllDto, ProjectOrderListByCompanyDto } from './dto/create-project_order.dto';
import { UpdateProjectOrderDto } from './dto/update-project_order.dto';
import { ApiTags ,ApiQuery ,ApiOperation } from '@nestjs/swagger';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';

@Controller('project-order')
@ApiTags('工程订单接口')
export class ProjectOrderController {
  constructor(private readonly projectOrderService: ProjectOrderService) {}

  @Post('add')
  @ApiOperation({ summary: '创建工程工单', description: '创建工程工单' }) 
  async create(@Body() createProjectOrderDto: CreateProjectOrderDto) {
    try {
      return apiAmendFormat(await this.projectOrderService.create(createProjectOrderDto))
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('list_all')
  @ApiOperation({ summary: '获取所有工程工单，管理员使用', description: '获取所有工程工单，带分页' }) 
  async findAll(@Body() dto :ProjectOrderListAllDto) {
    try {
      let page = 1;
      let limit = 10;
      page = Number(dto.page) || 1
      limit = Number(dto.limit) || 10
      let conditions = {}
      let data =  await this.projectOrderService.findAll(page,limit,{ conditions });
      return apiAmendFormat(data,{
        isTakeResponse :false,
      })
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('list_by_companyid')
  @ApiOperation({ summary: '获取公司的所有工程工单', description: '根据公司ID获取该公司所有的工程工单' }) 
  async findProjectOrderByCompany(@Body() dto :ProjectOrderListByCompanyDto){
    try {
      let page = 1;
      let limit = 10;
      page = Number(dto.page) || 1
      limit = Number(dto.limit) || 10
      let conditions = { company_id :dto.company_id}
      let data =  await this.projectOrderService.findAll(page,limit,{ conditions });
      return apiAmendFormat(data,{
        isTakeResponse :false,
      })
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

}
