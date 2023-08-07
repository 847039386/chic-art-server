import { Controller, Get, Body, Patch, Param, Delete ,Query, Post, UseGuards ,Request } from '@nestjs/common';
import { ApiTags ,ApiOperation ,ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserStateDto ,UpdateUserNameDto ,UpdateUserPhoneDto } from './dto/update-user.dto';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { SearchUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

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

  @Patch('up_name')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '修改用户真实姓名', description: '修改用户真实姓名' }) 
  async updateInfoName(@Body() dto: UpdateUserNameDto ,@Request() req) {
    try {
      let user_id = req.user.id;
      let userNamePattern = /^([\u4e00-\u9fa5]{2,5})$/;
      console.log(userNamePattern.test(dto.name),dto.name,dto)
      if(!userNamePattern.test(dto.name)){
        throw new BaseException(ResultCode.USER_NAME_VERIFY,{})
      }

      return apiAmendFormat(await this.userService.updateInfo(user_id,{ name :dto.name }))

    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('up_phone')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '修改用户手机号', description: '修改用户手机号' }) 
  async updateInfoPhone(@Body() dto: UpdateUserPhoneDto ,@Request() req) {
    try {
      let user_id = req.user.id;
      let userPhonePattern = /^(1(3|4|5|7|8)\d{9})|(\d{3,4}-)?\d{6,8}$/;
      if(!userPhonePattern.test(dto.phone)){
        throw new BaseException(ResultCode.USER_PHONE_VERIFY,{})
      }
      
      return apiAmendFormat(await this.userService.updateInfo(user_id,{ phone :dto.phone}))

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
