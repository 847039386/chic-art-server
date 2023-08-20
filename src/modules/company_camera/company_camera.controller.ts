import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CompanyCameraService } from './company_camera.service';
import { CreateCompanyCameraDto ,AssignCameraToCompanyDto } from './dto/create-company_camera.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { Types } from 'mongoose';

@Controller('api/company-camera')
@ApiTags('公司摄像头关系接口')
export class CompanyCameraController {
  constructor(private readonly companyCameraService: CompanyCameraService) {}

  
  @Post('add')
  @ApiOperation({ summary: '分配摄像头', description: '根据摄像头ID和公司ID来给摄像头分配' })
  async assignCompany(@Body() dto: AssignCameraToCompanyDto) {
    try {
      if(!dto.camera_id || !dto.company_id ){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      if(await this.companyCameraService.isExist(dto)){
        throw new BaseException(ResultCode.COMPANY_CAMERA_IS_EXIST,{})
      }else{
        return apiAmendFormat(await this.companyCameraService.create(dto));
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('list_by_companyid')
  @ApiQuery({ name: 'page' ,description:'当前页数' ,required:false})
  @ApiQuery({ name: 'limit' ,description:'每页数量' ,required:false})
  @ApiQuery({ name: 'company_id' ,description:'公司ID' ,required:false})
  @ApiOperation({ summary: '获取公司所有的摄像头', description: '根据公司ID获取公司所有的摄像头' }) 
  async findByCompanyId(@Query() query) {
    try {
      let company_id = new Types.ObjectId(query.company_id)
      let page = Number(query.page) || 1
      let limit = Number(query.limit) || 10
      let result =  await this.companyCameraService.findAll(page,limit,{ 
        populate :{
          path:'camera_id'
        },
        conditions: { company_id } 
      });
      return apiAmendFormat(result,{
        isTakeResponse :false,
      })
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Delete('del')
  @ApiQuery({ name: 'id' ,description:'公司摄像头关系表ID'})
  @ApiOperation({ summary: '删除给公司分配的摄像头', description: '根据id删除给公司分配的摄像头' }) 
  async remove(@Query('id') id: string) {
    try {
      if(id){
        return apiAmendFormat(await this.companyCameraService.remove(id))
      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }


}
