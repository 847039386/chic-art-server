import { Controller, Get, Body, Patch, Param, Delete ,Query, Post } from '@nestjs/common';
import { ApiTags ,ApiOperation ,ApiQuery } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserInfoDto ,UpdateUserStateDto } from './dto/update-user.dto';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { SearchUserDto } from './dto/create-user.dto';

@Controller('api/user')
@ApiTags('用户接口')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('list')
  @ApiOperation({ summary: '用户列表', description: '返回用户列表，带分页' }) 
  async findAll(@Body() dto :SearchUserDto) {
    
    try {
      let data =  await this.userService.findAll(dto);
      return apiAmendFormat(data,{
        isTakeResponse :false,
      })
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }

  }

  @Patch('up_info')
  @ApiOperation({ summary: '修改用户信息', description: '修改用户信息，这里目前只有name' }) 
  async updateInfo(@Body() dto: UpdateUserInfoDto) {
    try {
      return apiAmendFormat(await this.userService.updateInfo(dto))
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('up_state')
  @ApiOperation({ summary: '修改用户状态', description: '修改用户状态，0是正常1是被封禁' }) 
  async updateState(@Body() dto: UpdateUserStateDto) {
    try {
      return apiAmendFormat(await this.userService.updateState(dto))
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Get('urp')
  @ApiQuery({ name: 'user_id', description:'用户ID'})
  @ApiOperation({ summary: '用户的权限信息', description: '获取用户所在的用户组，所拥有的角色，和所有权限' }) 
  async userURP(@Query('user_id') user_id){
    try {
      return apiAmendFormat(await this.userService.getUserURP(user_id))
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }
}
