import { Controller, Get, Body, Patch, Param, Delete ,Query, Post, UseGuards ,Request } from '@nestjs/common';
import { ApiTags ,ApiOperation ,ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserStateDto } from './dto/update-user.dto';
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
  @ApiQuery({ name: 'name' ,description:'真实姓名'})
  @ApiOperation({ summary: '修改用户真实姓名', description: '修改用户真实姓名' }) 
  async updateInfoName(@Query('name') name: string ,@Request() req) {
    try {
      let user_id = req.user.id;
      let userNamePattern = /^[\u4e00-\u9fa5]{2,5}$/;
      if(!userNamePattern.test(name)){
        throw new BaseException(ResultCode.USER_NAME_VERIFY,{})
      }

      return apiAmendFormat(await this.userService.updateInfo(user_id,{ name }))

    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('up_nickname')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'nickname' ,description:'昵称'})
  @ApiOperation({ summary: '修改用户昵称', description: '修改用户昵称' }) 
  async updateInfoNickName(@Query('nickname') nickname: string ,@Request() req) {
    try {
      let user_id = req.user.id;
      // 昵称1-16位
      let userNamePattern = /^.{1,16}$/;
      if(!userNamePattern.test(nickname)){
        throw new BaseException(ResultCode.USER_NAME_VERIFY,{})
      }

      return apiAmendFormat(await this.userService.updateInfo(user_id,{ nickname }))

    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('up_phone')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'phone' ,description:'手机号'})
  @ApiOperation({ summary: '修改用户手机号', description: '修改用户手机号' }) 
  async updateInfoPhone(@Query('phone') phone: string ,@Request() req) {
    try {
      let user_id = req.user.id;
      let userPhonePattern = /^\d{7,8}$|^1\d{10}$|^(0\d{2,3}-?|0\d2,3 )?[1-9]\d{4,7}(-\d{1,8})?$/;
      if(!userPhonePattern.test(phone)){
        throw new BaseException(ResultCode.USER_PHONE_VERIFY,{})
      }
      
      return apiAmendFormat(await this.userService.updateInfo(user_id,{ phone }))

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
