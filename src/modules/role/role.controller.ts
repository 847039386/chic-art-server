import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleInfoDto ,UpdateRoleAvailableDto } from './dto/update-role.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';

@Controller('api/role')
@ApiTags('角色接口') 
export class RoleController {

  constructor(private readonly roleService: RoleService) {}

  @Post('add')
  @ApiOperation({ summary: '创建角色', description: '创建角色' }) 
  async create(@Body() dto: CreateRoleDto) {
    try {
      return apiAmendFormat(await this.roleService.create(dto));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('list')
  @ApiOperation({ summary: '查询角色', description: '查询所有角色，不分页,返回' }) 
  async findAll() {
    try {
      return apiAmendFormat(await this.roleService.findAll());
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('up_available')
  @ApiOperation({ summary: '修改角色可用状态', description: '修改角色可用状态，来确保角色是否启用' }) 
  async updateAvailable(@Body() dto: UpdateRoleAvailableDto) {
    try {
      return apiAmendFormat(await this.roleService.updateAvailable(dto));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('up_info')
  @ApiOperation({ summary: '修改角色信息', description: '修改角色的信息，包括角色名称和角色描述' }) 
  async updateInfo(@Body() dto: UpdateRoleInfoDto) {
    try {
      return apiAmendFormat(await this.roleService.updateInfo(dto));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Delete('del/:id')
  @ApiOperation({ summary: '查询权限树', description: '查询所有权限，不分页,返回树形结构' }) 
  async remove(@Param('id') id: string) {
    try {
      return apiAmendFormat(await this.roleService.remove(id));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

}
