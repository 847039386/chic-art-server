import { Controller, Get, Post, Body, Patch, Param, Delete ,Query } from '@nestjs/common';
import { CameraService } from './camera.service';
import { CreateCameraDto ,SearchCameraDto ,SearchCameraDCDto } from './dto/create-camera.dto';
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
      let page = Number(dto.page) || 1
      let limit = Number(dto.limit) || 10
      let match = { }
      if(typeof dto.state != 'undefined' && dto.state != null){
        match = Object.assign(match,{ state :dto.state})
      }
      let data =  await this.cameraService.findAll(page,limit,{ conditions: match });
      return apiAmendFormat(data,{
        isTakeResponse :false,
      })
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Post('clist')
  @ApiOperation({ summary: '摄像头列表，带公司的', description: '摄像头列表，带公司的' })
  async findAllHaveCompany(@Body() dto :SearchCameraDCDto) {
    try {
      let page = Number(dto.page) || 1
      let limit = Number(dto.limit) || 10
      let match = { }
      if(typeof dto.state != 'undefined' && dto.state != null){
        match = Object.assign(match,{ state :dto.state})
      }
      if(typeof dto.no != 'undefined' && dto.no != null){
        match = Object.assign(match,{ no : Number(dto.no) })
      }
      let result =  await this.cameraService.findAllHaveCompany(page,limit,match);
      return apiAmendFormat(result,{
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

 
}
