import { Controller, Get, Post, Body, Patch, Param, Delete ,Query ,Request, UseGuards } from '@nestjs/common';
import { ProjectOrderService } from './project_order.service';
import { CreateProjectOrderDto, ProjectOrderListAllDto, ProjectOrderListByCompanyIdDto } from './dto/create-project_order.dto';
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

      let namePattern = /^[0-9A-Za-z\u4e00-\u9fa5\s]{1,16}$/;
      if(!namePattern.test(dto.name)){
        throw new BaseException(ResultCode.PROJECT_ORDER_NAME_VERIFY,{})
      }


      let customerPattern = /^[0-9A-Za-z\u4e00-\u9fa5\s]{1,16}$/;
      if(!customerPattern.test(dto.customer)){
        throw new BaseException(ResultCode.PROJECT_ORDER_CUSTOMER_VERIFY,{})
      }

      let phonePattern = /^\d{7,8}$|^1\d{10}$|^(0\d{2,3}-?|0\d2,3 )?[1-9]\d{4,7}(-\d{1,8})?$/;
      if(!phonePattern.test(dto.phone)){
        throw new BaseException(ResultCode.COMMON_PHONE_VERIFY,{})
      }

      let addressPattern = /^.{1,120}$/;
      if(!addressPattern.test(dto.address)){
        throw new BaseException(ResultCode.PROJECT_ORDER_ADDRESS_VERIFY,{})
      }


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
  @ApiQuery({ name: 'id' ,description:'工程订单ID'})
  @ApiOperation({ summary: '根据ID查看工程订单详细信息', description: '根据ID查看工程订单详细信息' }) 
  async updateStep(@Query('id') id :string ) {
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
      let project_order_info = await this.projectOrderService.findById(id);
      if(!project_order_info){
        throw new BaseException(ResultCode.PROJECT_ORDER_IS_NOT,{})
      }else{
        if(project_order_info.state !== 0){
          // 不允许除了进行中的订单进行修改
          throw new BaseException(ResultCode.PROJECT_ORDER_NOT_ALLOW,{})
        }
      }
      let step = project_order_info.step + 1;
      let total = project_order_info.progress_template.length - 1;
      if(isNaN(step) || isNaN(total)){
        throw new BaseException(ResultCode.ERROR,{})
      }else{
        if(step >= total){
          return apiAmendFormat(await this.projectOrderService.finish(id))
        }else{
          return apiAmendFormat(await this.projectOrderService.updateById(id,{ step }))
        }
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('up_name')
  @ApiQuery({ name: 'id' ,description:'工程订单ID'})
  @ApiQuery({ name: 'name' ,description:'工程订单名称'})
  @ApiOperation({ summary: '根据ID修改项目名称', description: '根据ID修改项目名称' }) 
  async updateInfoName(@Query() query) {
    try {
      const id = query.id;
      const name = query.name;
      let namePattern = /^[0-9A-Za-z\u4e00-\u9fa5\s]{1,16}$/;
      if(!namePattern.test(name)){
        throw new BaseException(ResultCode.PROJECT_ORDER_NAME_VERIFY,{})
      }
      if(!id){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      
      return apiAmendFormat(await this.projectOrderService.updateById(id,{ name}))

    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('up_customer')
  @ApiQuery({ name: 'id' ,description:'工程订单ID'})
  @ApiQuery({ name: 'customer' ,description:'工程订单名称'})
  @ApiOperation({ summary: '根据ID修改对接客户', description: '根据ID修改对接客户' }) 
  async updateInfoCustomer(@Query() query) {
    try {
      const id = query.id;
      const customer = query.customer;
      let customerPattern = /^[0-9A-Za-z\u4e00-\u9fa5\s]{1,16}$/;
      if(!customerPattern.test(customer)){
        throw new BaseException(ResultCode.PROJECT_ORDER_CUSTOMER_VERIFY,{})
      }
      if(!id){
        throw new BaseException(ResultCode.PROJECT_ORDER_IS_NOT,{})
      }
      
      return apiAmendFormat(await this.projectOrderService.updateById(id,{ customer}))

    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }


  @Patch('up_phone')
  @ApiQuery({ name: 'id' ,description:'工程订单ID'})
  @ApiQuery({ name: 'phone' ,description:'客户电话'})
  @ApiOperation({ summary: '根据ID修改客户电话', description: '根据ID修改客户电话' }) 
  async updateInfoPhone(@Query() query) {
    try {
      const id = query.id;
      const phone = query.phone;
      let phonePattern = /^\d{7,8}$|^1\d{10}$|^(0\d{2,3}-?|0\d2,3 )?[1-9]\d{4,7}(-\d{1,8})?$/;
      if(!phonePattern.test(phone)){
        throw new BaseException(ResultCode.COMMON_PHONE_VERIFY,{})
      }
      if(!id){
        throw new BaseException(ResultCode.PROJECT_ORDER_IS_NOT,{})
      }
      
      return apiAmendFormat(await this.projectOrderService.updateById(id,{ phone}))

    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }


  @Patch('up_address')
  @ApiQuery({ name: 'id' ,description:'工程订单ID'})
  @ApiQuery({ name: 'address' ,description:'工程订单地址'})
  @ApiOperation({ summary: '根据ID修改项目地址', description: '根据ID修改项目地址' }) 
  async updateInfoAddress(@Query() query) {
    try {
      const id = query.id;
      const address = query.address;
      let addressPattern = /^.{1,120}$/;
      if(!addressPattern.test(address)){
        throw new BaseException(ResultCode.PROJECT_ORDER_ADDRESS_VERIFY,{})
      }
      if(!id){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      return apiAmendFormat(await this.projectOrderService.updateById(id,{ address }))
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Delete('del')
  @ApiQuery({ name: 'id' ,description:'工程订单ID'})
  @ApiOperation({ summary: '根据ID删除工程订单', description: '根据ID删除工程订单' }) 
  async remove(@Query('id') id) {
    try {
      if(!id){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      return apiAmendFormat(await this.projectOrderService.remove(id))
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

}
