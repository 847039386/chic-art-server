import { Controller, Get, Post, Body, Query, Delete , Patch ,Request, UseGuards } from '@nestjs/common';
import { ProjectOrderCustomerService } from './project_order_customer.service';
import { CreateProjectOrderCustomerDto } from './dto/create-project_order_customer.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { ProjectOrderService } from '../project_order/project_order.service';
import { UserService } from '../user/user.service';
import { MessageService } from '../message/message.service';

@Controller('api/project-order-customer')
@ApiTags('客户与项目订单关系接口')
export class ProjectOrderCustomerController {
  constructor(
    private readonly projectOrderCustomerService: ProjectOrderCustomerService,
    private readonly projectOrderService: ProjectOrderService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
  ){}

  @Post('add')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '根据项目订单ID添加客户', description: '根据项目订单ID添加客户' }) 
  async create(@Body() dto: CreateProjectOrderCustomerDto ,@Request() req) {
    try {
      let user_id = new Types.ObjectId(req.user.id);
      let project_order_id = new Types.ObjectId(dto.project_order_id)
      let project_order_info = await this.projectOrderService.findById(dto.project_order_id)

      const user_info =  await this.userService.findById(req.user.id)

      if(!user_info){
        throw new BaseException(ResultCode.USER_NOT_EXISTS)
      }


      if(!project_order_info){
        // 订单不存在
        throw new BaseException(ResultCode.PROJECT_ORDER_IS_NOT,{})
      }
      let poi = await this.projectOrderCustomerService.findOne({ user_id,project_order_id })
      if(!poi){
        // 发送两条消息，一条告诉员工已经加入，另外一条告诉订单负责人有人加入了
        const project_order_name = project_order_info.name;
        const project_order_user_id = project_order_info.user_id._id;
        // 申请人消息
        const myMessageDto = { title :'系统消息' , content :`您申请加入订单：${project_order_name}，请耐心等待项目负责人审核，您也可以线下联系对方。` ,recv_user_id :user_id }
        await this.messageService.createSystemMessage(myMessageDto)
        // 项目负责人消息
        const sqr_name = user_info.name || user_info.nickname;
        const heMessageDto = { title :'系统消息' , content :`${sqr_name} 客户申请加入您负责的 ${project_order_name} 订单，您可以在该订单的客户管理中添加或拒绝对方。` ,recv_user_id :project_order_user_id }
        await this.messageService.createSystemMessage(heMessageDto)

        let result = await this.projectOrderCustomerService.create(user_id,project_order_id);
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

        const poc_info = await this.projectOrderCustomerService.findById(id)

        if(!poc_info || !poc_info.user_id || !poc_info.project_order_id){
          throw new BaseException(ResultCode.PROJECT_ORDER_CUSTOMER_IS_NOT,{})
        }

        const project_order_name = poc_info.project_order_id.name;
        const heMessageDto = { title :'系统消息' , content :`您申请加入订单：${project_order_name} 的请求已被允许，如果页面中尚未存在该订单，可以手动下拉刷新订单列表` ,recv_user_id :poc_info.user_id._id }
        await this.messageService.createSystemMessage(heMessageDto)

        return apiAmendFormat(await this.projectOrderCustomerService.findByIdAndUpdate(id,{ state :1 }))
      }else{
        throw new BaseException(ResultCode.PROJECT_ORDER_CUSTOMER_IS_NOT,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Delete('audit_not')
  @ApiQuery({ name: 'id' ,description:'项目订单客户关系表ID'})
  @ApiOperation({ summary: '拒绝客户申请加入订单', description: '拒绝客户申请加入订单' }) 
  async auditNotEmployee(@Query('id') id: string){
    try {
      if(id){

        const poc_info = await this.projectOrderCustomerService.findById(id)

        if(!poc_info || !poc_info.user_id || !poc_info.project_order_id){
          throw new BaseException(ResultCode.PROJECT_ORDER_CUSTOMER_IS_NOT,{})
        }

        const project_order_name = poc_info.project_order_id.name;
        const heMessageDto = { title :'系统消息' , content :`您申请加入订单：${project_order_name} 的请求已被拒绝，您可以线下联系项目负责人申请加入订单` ,recv_user_id :poc_info.user_id._id }
        await this.messageService.createSystemMessage(heMessageDto)

        return apiAmendFormat(await this.projectOrderCustomerService.remove(id))
      }else{
        throw new BaseException(ResultCode.PROJECT_ORDER_CUSTOMER_IS_NOT,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }


  @Patch('up_visible_state')
  @ApiQuery({ name: 'id' ,description:'工程订单ID'})
  @ApiQuery({ name: 'visible_state' ,description:'可见状态'})
  @ApiOperation({ summary: '修改订单客户的可见状态', description: '主要针对员工是否可见' }) 
  async updateInfoVisibleState(@Query() query) {
    try {
      const id = query.id;
      let visible_state = Number(query.visible_state);
      if(!id){
        throw new BaseException(ResultCode.PROJECT_ORDER_CUSTOMER_IS_NOT,{})
      }

      if(isNaN(visible_state)){
        visible_state = 0
      }
      
      return apiAmendFormat(await this.projectOrderCustomerService.findByIdAndUpdate(id,{ visible_state }))

    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }


  @Delete('del')
  @ApiQuery({ name: 'id' ,description:'订单客户关系表ID'})
  @ApiOperation({ summary: '根据ID切断项目订单与客户的关系', description: '根据ID切断项目订单与客户的关系，审核拒绝后也调用此方法' }) 
  async remove(@Query('id') id: string) {
    try {
      if(id){
        return apiAmendFormat(await this.projectOrderCustomerService.remove(id))
      }else{
        throw new BaseException(ResultCode.PROJECT_ORDER_CUSTOMER_IS_NOT,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }





}
