import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolePermissionService } from './role_permission.service';
import { CreateRolePermissionDto } from './dto/create-role_permission.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';

@Controller('api/role-permission')
@ApiTags('角色权限接口') 
export class RolePermissionController {

  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Post('add')
  @ApiOperation({ summary: '给角色添加权限', description: '给角色添加一条权限，一个角色有多条权限' }) 
  async create(@Body() createRolePermissionDto: CreateRolePermissionDto) {
    try {
      return apiAmendFormat(await this.rolePermissionService.create(createRolePermissionDto));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }
  

  @Delete('del/:id')
  @ApiParam({ name :'id' , description:'角色权限的id' })
  @ApiOperation({ summary: '删除角色的权限', description: '删除角色的一条权限，一个用户有多条权限，该删除只删除一条权限' }) 
  async remove(@Param('id') id: string) {
    try {
      return apiAmendFormat(await this.rolePermissionService.remove(id));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }
}
