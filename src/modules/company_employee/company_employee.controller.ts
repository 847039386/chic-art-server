import { Controller, Get, Post, Body, Patch, Query, Delete } from '@nestjs/common';
import { CompanyEmployeeService } from './company_employee.service';
import { CreateCompanyEmployeeDto } from './dto/create-company_employee.dto';
import { UpdateCompanyEmployeeDto } from './dto/update-company_employee.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';

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

  @Post('list_by_company')
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
