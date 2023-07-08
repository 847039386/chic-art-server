import { Controller, Get, Body, Patch, Param, Delete ,Query } from '@nestjs/common';
import { ApiTags ,ApiOperation ,ApiQuery } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserInfoDto ,UpdateUserStateDto } from './dto/update-user.dto';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';

@Controller('api/user')
@ApiTags('用户接口')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  @ApiQuery({ name: 'limit', description:'每页数量'})
  @ApiQuery({ name: 'page' ,description:'当前页数'})
  @ApiOperation({ summary: '用户列表', description: '返回用户列表，带分页' }) 
  async findAll(@Query() query) {
    
    try {
      let page = 1;
      let limit = 10;
      page = Number(query.page) || 1
      limit = Number(query.limit) || 10
      let data =  await this.userService.findAll(page,limit);
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
}
