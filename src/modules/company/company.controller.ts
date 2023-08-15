import { Controller, Get, Post, Body, Patch, Request, Delete ,Query, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto, SearchCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto, UpdateCompanyWeightDto } from './dto/update-company.dto';
import { ApiBearerAuth, ApiOperation ,ApiQuery ,ApiTags } from '@nestjs/swagger';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { AuthGuard } from '@nestjs/passport';
import { listenerCount } from 'process';

@Controller('api/company')
@ApiTags('公司接口') 
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('add')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '创建公司', description: '创建一家公司' })
  async create(@Body() dto: CreateCompanyDto,@Request() req) {
    try {
      let user_id = req.user.id;
      if(dto.name){
        // 公司名称正则：2至12位，可以是中文、英文或数字
        let companyNamePattern = /^([a-zA-Z0-9\u4e00-\u9fa5]{2,12})$/;
        if(!companyNamePattern.test(dto.name)){
          throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
        }
        // 简介长度最短为2最长120
        let companyDescriptionPattern = /^([\s\S]{2,120})$/;
        if(!companyDescriptionPattern.test(dto.description)){
          throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
        }

        // 公司是否重名
        if(await this.companyService.isExist(dto.name)){
          throw new BaseException(ResultCode.COMPANY_IS_EXIST,{})
        }

        // 一个用户只允许注册一家公司
        if(await this.companyService.userIsExist(user_id)){
          throw new BaseException(ResultCode.COMPANY_USER_IS_EXIST,{})
        }

        return apiAmendFormat(await this.companyService.create(user_id,dto))

      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Post('list')
  @ApiOperation({ summary: '公司列表', description: '公司列表' })
  async findAll(@Body() dto :SearchCompanyDto) {
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
      if(typeof dto.censor != 'undefined' && dto.censor != null){
        match = Object.assign(match,{ censor :dto.censor})
      }
      let data =  await this.companyService.findAll(page,limit,{ populate:'user_id tag_ids' ,conditions: match });
      return apiAmendFormat(data,{
        isTakeResponse :false,
    })
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Post('censor_list')
  @ApiOperation({ summary: '公司审核列表', description: '公司审核列表' })
  async findCensorAll(@Body() dto :SearchCompanyDto) {
    try {
      let page = 1;
      let limit = 10;
      page = Number(dto.page) || 1
      limit = Number(dto.limit) || 10
      let match = { }
      if(dto.name){
        match = Object.assign(match,{ name : new RegExp(dto.name,'i') })
      }
      if(typeof dto.censor != 'undefined' && dto.censor != null){
        match = Object.assign(match,{ censor :dto.censor})
      }else{
        match = Object.assign(match,{ censor :{$in: [1,2]}})
      }
      let data =  await this.companyService.findAll(page,limit,{ populate:'user_id' ,conditions: match });
      return apiAmendFormat(data,{
        isTakeResponse :false,
    })
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('info')
  @ApiQuery({ name: 'id' ,description:'公司ID'})
  @ApiOperation({ summary: '公司信息', description: '根据公司ID返回一条' })
  async findById(@Query('id') id: string) {
    try {
      return apiAmendFormat(await this.companyService.findById(id))
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
    
  }

  @Get('user')
  @ApiQuery({ name: 'id' ,description:'用户ID'})
  @ApiOperation({ summary: '创始人用户的公司', description: '根据用户ID返回一条他的公司' })
  async findUser(@Query('user_id') id: string) {
    try {
      return apiAmendFormat(await this.companyService.findByUserId(id))
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('up_info')
  @ApiOperation({ summary: '修改公司信息', description: '根据id修改公司的信息' })
  async updateInfo(@Body() dto: UpdateCompanyDto) {
    try {
      let company = await this.companyService.findById(dto.id)
      if(dto.name == company.name){
        return apiAmendFormat(await this.companyService.updateInfo(dto))
      }else{
        if(await this.companyService.isExist(dto.name)){
          throw new BaseException(ResultCode.COMPANY_IS_EXIST,{})
        }
        return apiAmendFormat(await this.companyService.updateInfo(dto))
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
    
  }

  @Patch('up_weight')
  @ApiOperation({ summary: '修改公司权重', description: '根据id修改公司权重' })
  async updateWeight(@Body() dto: UpdateCompanyWeightDto) {
    try {
      return apiAmendFormat(await this.companyService.updateWeight(dto))
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('up_censor_allow')
  @ApiQuery({ name: 'id' ,description:'公司ID'})
  @ApiOperation({ summary: '审核公司通过', description: '根据id审核公司通过' })
  async updateCensorAllow(@Query('id') id) {
    try {
      return apiAmendFormat(await this.companyService.censorAllow(id))
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('up_censor_not_allow')
  @ApiQuery({ name: 'id' ,description:'公司ID'})
  @ApiOperation({ summary: '审核公司拒绝', description: '根据id审核公司拒绝' })
  async updateCensorNotAllow(@Query('id') id) {
    try {
      return apiAmendFormat(await this.companyService.censorNotAllow(id))
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

}
