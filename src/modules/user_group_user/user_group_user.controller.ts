import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserGroupUserService } from './user_group_user.service';
import { CreateUserGroupUserDto } from './dto/create-user_group_user.dto';
import { ApiTags ,ApiOperation ,ApiQuery  } from '@nestjs/swagger';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { UserGroupService } from '../user_group/user_group.service';

@Controller('api/user-group-user')
@ApiTags('用户组用户接口') 
export class UserGroupUserController {
  constructor(
    private readonly userGroupUserService: UserGroupUserService,
    ) {}

  @Post('add')
  @ApiOperation({ summary: '添加用户组用户之间的管理', description: '添加后可以让用户在用户组中' }) 
  async create(@Body() dto: CreateUserGroupUserDto) {
    try {
      if(!dto.user_group_id || !dto.user_id){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }

      if(await this.userGroupUserService.isExist(dto)){
        throw new BaseException(ResultCode.USER_GROUP_USER_IS_EXIST,{})
      }

      return apiAmendFormat(await this.userGroupUserService.create(dto));

    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Delete('del')
  @ApiQuery({ name: 'id' ,description:'用户组角色表的ID'})
  @ApiOperation({ summary: '删除用户组用户表ID', description: '删除该ID可使用户组和用户之间的关系断连' }) 
  async remove(@Query('id') id: string) {
    try {
      if(!id){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      return apiAmendFormat(await this.userGroupUserService.remove(id))
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('user-group')
  @ApiQuery({ name: 'user_id' ,description:'用户ID'})
  @ApiOperation({ summary: '获取用户所在的用户组', description: '根据user_id获取用户所在的用户组' }) 
  async getUserGroupByUserId(@Query('user_id') user_id: string) {
    try {
      if(!user_id){
        throw new BaseException(ResultCode.COMMON_PARAM_ERROR,{})
      }
      return apiAmendFormat(await this.userGroupUserService.getUserGroupByUserId(user_id));
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }


}
