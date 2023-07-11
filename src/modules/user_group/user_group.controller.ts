import { Types } from 'mongoose';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserGroupService } from './user_group.service';
import { CreateUserGroupDto } from './dto/create-user_group.dto';
import { UpdateUserGroupAvailableDto, UpdateUserGroupInfoDto } from './dto/update-user_group.dto';
import { ApiTags ,ApiOperation ,ApiParam } from '@nestjs/swagger';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { familyTree, getTreeIds, sonsTree, treeFormat } from 'src/shared/utils/tree.util';
import { UserGroupRoleService } from '../user_group_role/user_group_role.service';

@Controller('api/user-group')
@ApiTags('用户组接口') 
export class UserGroupController {
  constructor(private readonly userGroupService: UserGroupService ,private readonly userGroupRoleService: UserGroupRoleService) {}

  @Post('add')
  @ApiOperation({ summary: '创建用户组', description: '创建一个用户组' }) 
  async create(@Body() dto: CreateUserGroupDto) {

    try {

      let user_group = {
        name:dto.name,
        description:dto.description,
        available :dto.available || false,
        type:dto.type || 0,
      }
  
      if(dto.parent_id){
        let result = await this.userGroupRoleService.geRolesByUserGroupId(dto.parent_id)
        if(result && result.length > 0){
          throw new BaseException(ResultCode.USER_GROUP_BAN_PARENT_ADD_ROLE,{})
        }
        user_group = Object.assign(user_group,{ parent_id : new Types.ObjectId(dto.parent_id) })
      }

      return apiAmendFormat(await this.userGroupService.create(user_group));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('list')
  @ApiOperation({ summary: '用户组列表', description: '查询所有用户组，不分页' }) 
  async findAll() {
    try {
      let result = await this.userGroupService.findAll()
      let newResult = treeFormat(result)
      return apiAmendFormat(newResult,{isTakeResponse:false});
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('up_info')
  @ApiOperation({ summary: '修改用户组信息', description: '修改用户组信息，包括名称和描述' }) 
  async updateInfo(@Body() body: UpdateUserGroupInfoDto) {
    try {
      let id = body.id
      let description = body.description
      let name = body.name
      if(!id || !description || !name){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      return apiAmendFormat(await this.userGroupService.updateInfo(body));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('up_available')
  @ApiOperation({ summary: '修改用户组状态', description: '设置权限是否开启，开启后则会限制，不开启将不会受限制' }) 
  async updateAvailable(@Body() body: UpdateUserGroupAvailableDto) {
    try {
      let id = body.id
      if(!id && typeof body.available == 'boolean'){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      
      let result = treeFormat(await this.userGroupService.findAll())
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
        return apiAmendFormat(await this.userGroupService.updateAvailable(ids, body.available));
      }else{
        throw new BaseException(ResultCode.PERMISSION_PARENT_IS_CLOSE,{})
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }



  @Delete('del/:id')
  @ApiOperation({ summary: '删除用户组', description: '根据id删除用户组' }) 
  @ApiParam({ name:'id' ,description:'索引id' })
  async remove(@Param('id') id: string) {
    try {
      if(!id){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      return apiAmendFormat(await this.userGroupService.remove(id));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }
}

  
