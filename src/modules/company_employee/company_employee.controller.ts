import { Controller, Get, Post, Body, Patch, Query, Delete ,Request, UseGuards } from '@nestjs/common';
import { CompanyEmployeeService } from './company_employee.service';
import { CreateCompanyEmployeeDto } from './dto/create-company_employee.dto';
import { UpdateCompanyEmployeeGroupNameDto ,UpdateCallCompanyEmployeeGroupNameDto ,UpdateCompanyEmployeeIdentityTypeDto ,UpdateCompanyEmployeeRemarkDto } from './dto/update-company_employee.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { Types } from 'mongoose';
import { CompanyService } from '../company/company.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/company-employee')
@ApiTags('公司员工接口')
export class CompanyEmployeeController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly companyEmployeeService: CompanyEmployeeService
  ){}

  @Post('add')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '添加公司员工', description: '添加公司员工' }) 
  async create(@Body() dto: CreateCompanyEmployeeDto ,@Request() req) {
    // token中的userid就是登陆人
    let req_user_id = req.user.id;
    console.log(req.user.id)
    try {
      if(dto.company_id){
        let company :any = await this.companyService.findById(dto.company_id)
        if(company){

          if(company.audit_state != 0){
            throw new BaseException(ResultCode.COMPANY_AUDIT_NO)
          }

          if(company.user_id){
            if(company.user_id._id == req_user_id){
              throw new BaseException(ResultCode.COMPANY_EMPLOYEE_USER_ISBOSS,{})
            }else{
              let e_company :any = await this.companyEmployeeService.findOne({
                company_id :new Types.ObjectId(dto.company_id),
                user_id :new Types.ObjectId(req_user_id)
              })
              if(e_company){
                let identity_type = e_company.identity_type
                if(identity_type){
                  throw new BaseException(ResultCode.COMPANY_EMPLOYEE_IS_EXIST,{})
                }else{
                  throw new BaseException(ResultCode.COMPANY_EMPLOYEE_IS_EXIST_AUDIT,{})
                }
              }else{
                return apiAmendFormat(await this.companyEmployeeService.create(req_user_id,dto.company_id))
              }
            }
          }else{
            throw new BaseException(ResultCode.USER_NOT_EXISTS,{})
          }
        }else{
          throw new BaseException(ResultCode.COMPANY_NOT_EXIST,{})
        }
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
        let company = await this.companyService.findById(company_id)
        if(company){
          return apiAmendFormat({
            company,
            list :await this.companyEmployeeService.findEmployeesByCompanyId(company_id)
          })
        }else{
          throw new BaseException(ResultCode.COMPANY_NOT_EXIST,{})
        }
      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('list_by_userid')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'page' ,description:'当前页数' ,required :false})
  @ApiQuery({ name: 'limit' ,description:'每页数量' ,required :false})
  @ApiOperation({ summary: '公司员工列表', description: '根据公司ID查询公司所有员工' }) 
  async findCompanysByUserId(@Query() query ,@Request() req) {
    try {
      let page = 1;
      let limit = 10;
      let user_id = req.user.id
      page = Number(query.page) || 1;
      limit = Number(query.limit) || 10;
      console.log(user_id)
      // let result = await this.companyEmployeeService.findAll(page,limit,{
      //   conditions :{ user_id },
      //   populate : { path:'company_id'}
      // })
      let result = await this.companyEmployeeService.findCompanysByUserId(user_id,page,limit)
      return apiAmendFormat(result)
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
        return apiAmendFormat(await this.companyEmployeeService.updateById(id,{ audit_state : 1}))
      }else{
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('up_group_name')
  @ApiOperation({ summary: '修改员工组名', description: '修改员工组名' }) 
  async updateGroupName(@Body() dto: UpdateCompanyEmployeeGroupNameDto){
    try {
      // 任意字符 1-16位
      let groupNamePattern = /^.{1,16}$/
      if(!groupNamePattern.test(dto.group_name)){
        throw new BaseException(ResultCode.COMPANY_EMPLOYEE_GROUPNAME_ERROR,{})
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

  @Patch('up_remark')
  @ApiOperation({ summary: '修改备注', description: '修改备注' }) 
  async updateRemark(@Body() dto: UpdateCompanyEmployeeRemarkDto){
    try {
      // 任意字符 1-16位
      let remarkPattern = /^[0-9A-Za-z\u4e00-\u9fa5\s]{1,16}$/
      if(!remarkPattern.test(dto.remark)){
        throw new BaseException(ResultCode.COMPANY_EMPLOYEE_REMARK_ERROR,{})
      }
      if(dto.id){
        return apiAmendFormat(await this.companyEmployeeService.updateById(dto.id,{
          remark :dto.remark
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

  @Patch('up_identity_type')
  @ApiOperation({ summary: '修改员工身份状态', description: '修改员工身份状态' }) 
  async updateIdentityType(@Body() dto: UpdateCompanyEmployeeIdentityTypeDto){
    try {
      if(dto.id){
        let identity_type = Number(dto.identity_type)
        if(isNaN(identity_type)){
          identity_type = 0;
        }else{
          if(identity_type != 0 && identity_type != 1){
            identity_type = 0
          }
        }
        return apiAmendFormat(await this.companyEmployeeService.updateById(dto.id,{ identity_type }))
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

  @Get('one_uc_info')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'company_id' ,description:'当前页数' ,required :false})
  @ApiOperation({ summary: '获取员工在公司的身份信息', description: '根据token获取员工在公司的身份信息' }) 
  async findOneByUCInfo(@Query('company_id') company_id ,@Request() req) {
    try {
      let user_id = new Types.ObjectId(req.user.id)
      company_id = new Types.ObjectId(company_id);
      let result = await this.companyEmployeeService.findOne({user_id,company_id})
      return apiAmendFormat(result)
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }


}
