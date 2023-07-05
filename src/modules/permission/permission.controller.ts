import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionAvailableDto } from './dto/update-permission.dto';
import { ApiBody, ApiNotImplementedResponse, ApiOperation,  ApiTags } from '@nestjs/swagger';
import { apiAmendFormat } from 'src/common/decorators/api.decorator';
import { Types } from 'mongoose';
import { arrayToTree } from 'src/shared/utils/tools.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { DeletePermissionDto } from './dto/delete-permission.dto';

@Controller('api/permission')
@ApiTags('权限接口') 
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('add')
  // @ApiAmendDecorator({ module :'权限' ,subject:'权限添加' })
  @ApiOperation({ summary: '创建权限', description: '创建一条权限' }) 
  async create(@Body() createPermissionDto: CreatePermissionDto) {

    let permission = {
      name:createPermissionDto.name,
      description:createPermissionDto.description,
      available :true,
      type:createPermissionDto.type,
      code :createPermissionDto.code,
    }

    if(createPermissionDto.parent_id){
      permission = Object.assign(permission,{ parent_id : new Types.ObjectId(createPermissionDto.parent_id) })
    }

    try {
      return apiAmendFormat(await this.permissionService.create(permission));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
    
  }

  @Get('tree')
  // @ApiAmendDecorator({ module :'权限' ,subject:'权限查询' })
  @ApiOperation({ summary: '查询权限树', description: '查询所有权限，不分页,返回树形结构' }) 
  async findAll() {
    return apiAmendFormat(arrayToTree(await this.permissionService.findAll(),null));
  }


  @Patch('up_available')
  @ApiOperation({ summary: '修改权限状态', description: '设置权限是否开启，开启后则会限制，不开启将不会受限制' }) 
  updateAvailable(@Body() body: UpdatePermissionAvailableDto) {
    try {
      let id = body.id
      if(!id && typeof body.available == 'boolean'){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      return this.permissionService.updateAvailable(id, body.available);
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Delete('del')
  @ApiBody({type :DeletePermissionDto})
  @ApiOperation({ summary: '删除权限', description: '根据id删除权限' }) 
  async remove(@Body() body :DeletePermissionDto) {
    try {
      let id = body.id
      if(!id){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      return apiAmendFormat(await this.permissionService.remove(id));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }
}
