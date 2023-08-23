import { Controller, Get, Post, Body, Patch, Param, Delete ,Query, UseGuards } from '@nestjs/common';
import { ProjectOrderCameraService } from './project_order_camera.service';
import { CreateProjectOrderCameraDto } from './dto/create-project_order_camera.dto';
import { UpdateProjectOrderCameraNameDto ,UpdateProjectOrderCameraStateDto } from './dto/update-project_order_camera.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { Types } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { ProjectOrderService } from '../project_order/project_order.service';

@Controller('api/project-order-camera')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('项目订单监控关系接口')
export class ProjectOrderCameraController {
  constructor(
    private readonly projectOrderCameraService: ProjectOrderCameraService,
    private readonly projectOrderService: ProjectOrderService
  ){}

  @Post('add')
  @ApiOperation({ summary: '创建项目订单与监控联系', description: '创建项目订单与监控联系' }) 
  async create(@Body() dto: CreateProjectOrderCameraDto) {
    try {
      let po_info = await this.projectOrderService.findById(dto.project_order_id);
      if(!po_info){
        throw new BaseException(ResultCode.PROJECT_ORDER_IS_NOT,{})
      }else{
        if(po_info.state !== 0){
          throw new BaseException(ResultCode.PROJECT_ORDER_CAMERA_IF_PO_STATE,{})
        }
      }
      let cpc = await this.projectOrderCameraService.findOne({ company_camera_id: new Types.ObjectId(dto.company_camera_id) , project_order_id: new Types.ObjectId(dto.project_order_id)})
      if(!cpc){
        let data =  await this.projectOrderCameraService.create(dto);
        return apiAmendFormat(data,{
          isTakeResponse :false,
        })
      }else{
        throw new BaseException(ResultCode.PROJECT_ORDER_CAMERA_IS_EXIST,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('list_by_projectorderid')
  @ApiQuery({ name: 'project_order_id' ,description:'工程订单ID'})
  @ApiOperation({ summary: '根据项目订单ID获取该订单所有客户', description: '根据项目订单ID获取该订单所有客户' }) 
  async findByProjectOrderId(@Query('project_order_id') project_order_id: string){
    try {
      let data =  await this.projectOrderCameraService.findByProjectOrderId(project_order_id);
      return apiAmendFormat(data,{
        isTakeResponse :false,
      })
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Delete('del')
  @ApiQuery({ name: 'id' ,description:'项目订单监控关系ID'})
  @ApiOperation({ summary: '断联项目工单监控关系', description: '根据ID断联项目工单监控关系' }) 
  async remove(@Query('id') id: string) {
    try {
      if(id){
        return apiAmendFormat(await this.projectOrderCameraService.remove(id))
      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('info')
  @ApiQuery({ name: 'id' ,description:'项目订单摄像头ID'})
  @ApiOperation({ summary: '项目订单摄像头关系信息', description: '项目订单摄像头关系信息' }) 
  async findInfoById(@Query('id') id: string) {
    try {
      if(id){
        return apiAmendFormat(await this.projectOrderCameraService.findById(id))
      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('up_name')
  @ApiOperation({ summary: '修改订单摄像头别名', description: '修改订单摄像头别名' }) 
  async updateInfoName(@Body() dto: UpdateProjectOrderCameraNameDto) {
    try {
      let namePattern = /^.{1,20}$/
      if(!namePattern.test(dto.name)){
        throw new BaseException(ResultCode.PROJECT_ORDER_CAMERA_NAME_LIMIT,{})
      }
      if(!dto.id){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      return apiAmendFormat(await this.projectOrderCameraService.findOneAndUpdate(dto.id,{ name : dto.name }))
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('up_state')
  @ApiOperation({ summary: '修改订单摄像头状态', description: '修改订单摄像头状态' }) 
  async updateInfoState(@Body() dto: UpdateProjectOrderCameraStateDto) {
    try {
      let state = Number(dto.state)
      if(isNaN(state) || state > 1){
        state = 0;
      }
      if(!dto.id){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      return apiAmendFormat(await this.projectOrderCameraService.findOneAndUpdate(dto.id,{ state }))
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

}
