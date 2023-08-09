import { Controller, Get, Post, Body, Patch, Query, Delete } from '@nestjs/common';
import { CompanyEmployeeService } from './company_employee.service';
import { CreateCompanyEmployeeDto } from './dto/create-company_employee.dto';
import { UpdateCompanyEmployeeGroupNameDto ,UpdateCallCompanyEmployeeGroupNameDto } from './dto/update-company_employee.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { Types } from 'mongoose';

@Controller('api/company-employee')
@ApiTags('公司员工接口')
export class CompanyEmployeeController {
  constructor(private readonly companyEmployeeService: CompanyEmployeeService) {}

  @Post('add')
  @ApiOperation({ summary: '添加公司员工', description: '添加公司员工' }) 
  async create(@Body() dto: CreateCompanyEmployeeDto) {
    try {
      if(dto.company_id && dto.user_id){
        return apiAmendFormat(await this.companyEmployeeService.create(dto))
      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('list_by_company')
  @ApiQuery({ name: 'company_id' ,description:'公司ID'})
  @ApiOperation({ summary: '公司员工列表', description: '根据公司ID查询公司所有员工' }) 
  async findEmployeesByCompanyId(@Query('company_id') company_id: string) {
    try {
      if(company_id){
        return apiAmendFormat(await this.companyEmployeeService.findEmployeesByCompanyId(company_id))
      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('audit_ok')
  @ApiQuery({ name: 'id' ,description:'公司员工ID'})
  @ApiOperation({ summary: '公司员工申请允许', description: '公司员工申请允许' }) 
  async auditEmployee(@Query('id') id: string){
    try {
      if(id){
        return apiAmendFormat(await this.companyEmployeeService.updateEmployeeIdentityType(id,1))
      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('up_group_name')
  @ApiOperation({ summary: '给公司员工分组', description: '给公司员工分组' }) 
  async updateGroupName(@Body() dto: UpdateCompanyEmployeeGroupNameDto){
    try {
      // 任意字符 1-16位
      let groupNamePattern = /^.{1,16}$/
      if(!groupNamePattern.test(dto.group_name)){
        throw new BaseException(ResultCode.COMPANY_EMPLOYEE_GROUPNAME_LIMIT,{})
      }
      if(dto.id){
        return apiAmendFormat(await this.companyEmployeeService.updateById(dto.id,{
          group_name :dto.group_name
        }))

      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('up_call_group_name')
  @ApiOperation({ summary: '移出分组到默认分组', description: '移出分组到默认分组' }) 
  async updateGroupNameToDefault(@Body() dto: UpdateCallCompanyEmployeeGroupNameDto){
    try {
      
      if(dto.company_id && dto.group_name){
        return apiAmendFormat(await this.companyEmployeeService.updateMany({
          company_id:new Types.ObjectId(dto.company_id),
          group_name:dto.group_name
        },{
          group_name :'默认分组'
        }))

      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }


  @Delete('del')
  @ApiQuery({ name: 'id' ,description:'公司员工关系表ID'})
  @ApiOperation({ summary: '删除公司员工', description: '根据id删除员工' }) 
  async remove(@Query('id') id: string) {
    try {
      if(id){
        return apiAmendFormat(await this.companyEmployeeService.remove(id))
      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }


}
