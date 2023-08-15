import { Controller, Get, Post, Body, Patch, Param, Delete ,Query ,Request, UseGuards } from '@nestjs/common';
import { ProjectOrderService } from './project_order.service';
import { CreateProjectOrderDto, ProjectOrderListAllDto, ProjectOrderListByCompanyIdDto } from './dto/create-project_order.dto';
import { UpdateProjectOrderStepDto } from './dto/update-project_order.dto';
import { ApiTags ,ApiQuery ,ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';

@Controller('api/project-order')
@ApiTags('工程订单接口')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class ProjectOrderController {
  constructor(private readonly projectOrderService: ProjectOrderService) {}

  @Post('add')
  @ApiOperation({ summary: '创建工程工单', description: '创建工程工单' }) 
  async create(@Body() dto: CreateProjectOrderDto ,@Request() req) {
    try {
      let user_id = req.user.id;
      return apiAmendFormat(await this.projectOrderService.create(user_id,dto))
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('info')
  @ApiQuery({ name: 'id' ,description:'工程订单ID'})
  @ApiOperation({ summary: '根据ID查看工程订单详细信息', description: '根据ID查看工程订单详细信息' }) 
  async findById(@Query('id') id: string) {
    try {
      return apiAmendFormat(await this.projectOrderService.findById(id))
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Post('list_all')
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

  @Post('list_by_companyid')
  @ApiOperation({ summary: '获取公司的所有工程工单', description: '根据公司ID获取该公司所有的工程工单' }) 
  async findProjectOrderByCompany(@Body() dto :ProjectOrderListByCompanyIdDto){
    try {
      let page = 1;
      let limit = 10;
      page = Number(dto.page) || 1
      limit = Number(dto.limit) || 10
      let conditions = { company_id : new Types.ObjectId(dto.company_id) }
      let data =  await this.projectOrderService.findAll(page,limit,{ conditions });
      return apiAmendFormat(data,{
        isTakeResponse :false,
      })
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('up_step')
  @ApiOperation({ summary: '根据ID查看工程订单详细信息', description: '根据ID查看工程订单详细信息' }) 
  async updateStep(@Body() dto :UpdateProjectOrderStepDto,@Request() req) {
    try {
      /**
       * 举例，步近器会根据进度模板数组长度进行增长
       * 例如进度模板：[订单开始，订单工作，订单结束]
       * 步进器的值应：0,1,2
       * 那么进度模板长度应该是：3
       * 所以步近器完成订单时的值应是：2
       * 而该api接收到的total值则是进度模板的长度：3
       * 所以如下变量的total=dto.total-1
       * 所以当step >= total 的时候修改订单状态为完成
       * 这里不考虑读库做total控制，因为还得多读个库懒得写，非法操作就让他非法操作吧，反正限制了类型
       */
      let step = Number(dto.step)
      let total = Number(dto.total-1)
      if(isNaN(step) || isNaN(total)){
        throw new BaseException(ResultCode.ERROR,{})
      }else{
        if(step >= total){
          return apiAmendFormat(await this.projectOrderService.updateById(dto.id,{ step ,state: 1}))
        }else{
          return apiAmendFormat(await this.projectOrderService.updateById(dto.id,{ step }))
        }
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

}
