import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionAvailableDto ,UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiBody, ApiNotImplementedResponse, ApiOperation,  ApiParam,  ApiTags } from '@nestjs/swagger';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { Types } from 'mongoose';
import { deepClone} from 'src/shared/utils/tools.util';
import { sonsTree ,treeFormat ,handleTree ,familyTree ,getTreeIds } from 'src/shared/utils/tree.util'

import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { DeletePermissionDto } from './dto/delete-permission.dto';

@Controller('api/permission')
@ApiTags('权限接口') 
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('add')
  @ApiOperation({ summary: '创建权限', description: '创建一条权限' }) 
  async create(@Body() dto: CreatePermissionDto) {

    try {
      let permission = {
        name:dto.name,
        description:dto.description,
        available :dto.available || false,
        type:dto.type,
        code :dto.code,
      }
  
      if(dto.parent_id){
        permission = Object.assign(permission,{ parent_id : new Types.ObjectId(dto.parent_id) })
      }

      return apiAmendFormat(await this.permissionService.create(permission));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('list')
  @ApiOperation({ summary: '权限列表', description: '查询所有权限，不分页' }) 
  async findAll() {
    try {
      let result = await this.permissionService.findAll()
      let newResult = treeFormat(result)
      // let tree = handleTree(JSON.parse(JSON.stringify(newResult)),'_id','parent_id');
      return apiAmendFormat(newResult,{isTakeResponse:false});
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }


  @Patch('up_available')
  @ApiOperation({ summary: '修改权限状态', description: '设置权限是否开启，开启后则会限制，不开启将不会受限制' }) 
  async updateAvailable(@Body() body: UpdatePermissionAvailableDto) {
    try {
      let id = body.id
      if(!id && typeof body.available == 'boolean'){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      let result = treeFormat(await this.permissionService.findAll())
      let parent:any = familyTree(result,id)
      let isUp = true;
      if(parent.length > 1){
        for (let index = 1; index < parent.length; index++) {
          if(!parent[index].available){
            isUp = false
            break
          }
        }
      }
      if(isUp){
        let children = sonsTree(result,id)
        let ids = getTreeIds(children).concat(id)
        return apiAmendFormat(await this.permissionService.updateAvailable(ids, body.available));
      }else{
        throw new BaseException(ResultCode.PERMISSION_PARENT_IS_CLOSE,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('up_info')
  @ApiOperation({ summary: '修改权限状态', description: '设置权限是否开启，开启后则会限制，不开启将不会受限制' }) 
  async updateInfo(@Body() body: UpdatePermissionDto) {
    try {
      let id = body.id
      let code = body.code
      let description = body.description
      let type = body.type
      let name = body.name
      if(!id || !code || !description || !type || !name){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      return apiAmendFormat(await this.permissionService.updateInfo(body));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Delete('del/:id')
  @ApiOperation({ summary: '删除权限', description: '根据id删除权限' }) 
  @ApiParam({ name:'id' ,description:'索引id' })
  async remove(@Param('id') id: string) {
    try {
      if(!id){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      return apiAmendFormat(await this.permissionService.remove(id));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }
}
