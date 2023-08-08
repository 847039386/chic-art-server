import { Controller, Get, Post, Body, Patch, Param, Delete ,Query } from '@nestjs/common';
import { CameraService } from './camera.service';
import { CreateCameraDto ,SearchCameraDto } from './dto/create-camera.dto';
import { UpdateCameraDto ,AssignCameraToCompanyDto } from './dto/update-camera.dto';
import { ApiOperation ,ApiTags ,ApiQuery } from '@nestjs/swagger';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { apiAmendFormat } from 'src/shared/utils/api.util';

@Controller('api/camera')
@ApiTags('摄像头接口') 
export class CameraController {
  constructor(private readonly cameraService: CameraService) {}

  @Post('add')
  @ApiOperation({ summary: '添加摄像头', description: '添加摄像头' })
  async create(@Body() dto: CreateCameraDto) {
    try {
      if(!dto.iccid || !dto.name || !dto.url){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      return apiAmendFormat(await this.cameraService.create(dto))
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }


  @Post('list')
  @ApiOperation({ summary: '摄像头列表', description: '摄像头列表' })
  async findAll(@Body() dto :SearchCameraDto) {
    try {
      let page = 1;
      let limit = 10;
      page = Number(dto.page) || 1
      limit = Number(dto.limit) || 10
      let match = { }
      if(dto.name){
        match = Object.assign(match,{ name : new RegExp(dto.name,'i') })
      }
      if(typeof dto.state != 'undefined' && dto.state != null){
        match = Object.assign(match,{ state :dto.state})
      }
      if(typeof dto.no != 'undefined' && dto.no != null){
        match = Object.assign(match,{ no :dto.no})
      }
      if(typeof dto.iccid != 'undefined' && dto.iccid != null){
        match = Object.assign(match,{ iccid :dto.iccid})
      }
      let data =  await this.cameraService.findAll(page,limit,{ populate:{ path :'company_id' ,select:{ name:1 , }} ,conditions: match });
      return apiAmendFormat(data,{
        isTakeResponse :false,
      })
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  
  @Patch('up_info')
  @ApiOperation({ summary: '修改摄像头', description: '根据id修改摄像头信息' })
  async updateInfo(@Body() dto: UpdateCameraDto) {
    try {
      if(!dto.iccid || !dto.name || !dto.url || !dto.id){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      return apiAmendFormat(await this.cameraService.updateInfo(dto));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Delete('del')
  @ApiQuery({ name: 'id' ,description:'摄像头ID'})
  @ApiOperation({ summary: '删除摄像头', description: '根据id删除摄像头' }) 
  async remove(@Query('id') id: string) {
    try {
      if(!id){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      return apiAmendFormat(await this.cameraService.remove(id));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }


  @Get('company')
  @ApiQuery({ name: 'company_id' ,description:'摄像头ID'})
  @ApiOperation({ summary: '公司摄像头', description: '根据公司ID获取公司被分配的摄像头' })
  async findByCompanyId(@Query('company_id') company_id :string) {
    try {
      if(!company_id){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      return apiAmendFormat(await this.cameraService.findByCompanyId(company_id),{
        isTakeResponse :false,
      })
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('assign_company')
  @ApiOperation({ summary: '分配摄像头', description: '根据摄像头ID和公司ID来给摄像头分配' })
  async assignCompany(@Body() dto: AssignCameraToCompanyDto) {
    try {
      if(!dto.id || !dto.company_id ){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      return apiAmendFormat(await this.cameraService.assignCompany(dto.id,dto.company_id));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('unassign_company')
  @ApiOperation({ summary: '取消分配', description: '将摄像头取消分配恢复到闲置状态' })
  async unAssignCompany(@Body() dto: AssignCameraToCompanyDto) {
    try {
      if(!dto.id ){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      return apiAmendFormat(await this.cameraService.unAssignCompany(dto.id));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }
  
}
