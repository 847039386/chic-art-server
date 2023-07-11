import { Controller, Get, Post, Body, Patch, Param, Delete,Query } from '@nestjs/common';
import { UserGroupRoleService } from './user_group_role.service';
import { CreateUserGroupRoleDto } from './dto/create-user_group_role.dto';
import { ApiOperation, ApiTags ,ApiQuery } from '@nestjs/swagger';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { familyTree, getTreeIds, sonsTree, treeFormat } from 'src/shared/utils/tree.util';
import { UserGroupService } from '../user_group/user_group.service';
import { apiAmendFormat } from 'src/shared/utils/api.util';

@Controller('api/user-group-role')
@ApiTags('用户组角色接口')
export class UserGroupRoleController {

  constructor(private readonly userGroupRoleService: UserGroupRoleService ,private readonly userGroupService :UserGroupService) {}

  @Post('add')
  @ApiOperation({ summary: '给用户组添加角色', description: '给用户组添加一个角色，一个用户组有多个角色' }) 
  async create(@Body() dto: CreateUserGroupRoleDto) {
    try {
      if(await this.userGroupRoleService.isExist(dto)){
        throw new BaseException(ResultCode.USER_GROUP_ROLE_IS_EXIST,{})
      }else{
        // 获取所有用户组
        let result = treeFormat(await this.userGroupService.findAll())
        // 根据用户组id向下查找子集，如果有子集证明他是父级所以不让其添加角色
        let children = sonsTree(result,dto.user_group_id)
        if(children.length > 0){
          throw new BaseException(ResultCode.USER_GROUP_BAN_PARENT_ADD_ROLE,{})
        }
        return apiAmendFormat(await this.userGroupRoleService.create(dto));
      }
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }
  

  @Delete('del')
  @ApiQuery({ name: 'id' ,description:'用户组角色表的ID'})
  @ApiOperation({ summary: '删除用户组中的角色', description: '删除该ID可使用户组和角色之间的关系断连' }) 
  async remove(@Query('id') id: string) {
    try {
      return apiAmendFormat(await this.userGroupRoleService.remove(id));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('roles')
  @ApiQuery({ name: 'user_group_id' ,description:'用户组ID'})
  @ApiOperation({ summary: '用户组拥有的角色', description: '根据用户组id来查询这个用户组下所有的角色' }) 
  async findAll(@Query('user_group_id') user_group_id: string) {
    try {
      return apiAmendFormat(await this.userGroupRoleService.geRolesByUserGroupId(user_group_id));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

}
