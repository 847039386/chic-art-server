import { Controller, Get, Post, Body, Query, Param, Delete } from '@nestjs/common';
import { RolePermissionService } from './role_permission.service';
import { CreateRolePermissionDto } from './dto/create-role_permission.dto';
import { ApiOperation, ApiParam, ApiTags ,ApiQuery } from '@nestjs/swagger';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { PermissionService } from '../permission/permission.service';
import { sonsTree ,familyTree ,treeFormat, getTreeIds } from 'src/shared/utils/tree.util';

@Controller('api/role-permission')
@ApiTags('角色权限接口') 
export class RolePermissionController {

  constructor(private readonly rolePermissionService: RolePermissionService ,private readonly permissionService :PermissionService) {}

  @Post('add')
  @ApiOperation({ summary: '给角色添加权限', description: '给角色添加一条权限，一个角色有多条权限' }) 
  async create(@Body() dto: CreateRolePermissionDto) {
    try {
      
      if(!dto.permission_id || !dto.role_id){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      
      if(await this.rolePermissionService.isExist(dto)){
        throw new BaseException(ResultCode.ROLE_PERMISSION_IS_EXIST,{})
      }

      return apiAmendFormat(await this.rolePermissionService.create(dto));
      
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }
  

  @Delete('del')
  @ApiQuery({ name :'id' , description:'角色权限的id' })
  @ApiOperation({ summary: '删除角色的权限', description: '删除角色的一条权限，一个用户有多条权限，该删除只删除一条权限' }) 
  async remove(@Query('id') id: string) {
    try {
      return apiAmendFormat(await this.rolePermissionService.remove(id));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('permissions')
  @ApiQuery({ name :'role_id' , description:'角色id' })
  @ApiOperation({ summary: '角色拥有的权限', description: '根据角色ID查询角色下所有的权限' }) 
  async findAll(@Query('role_id') role_id: string) {
    try {
      return apiAmendFormat(await this.rolePermissionService.getPermissionByRoleId(role_id));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

}
