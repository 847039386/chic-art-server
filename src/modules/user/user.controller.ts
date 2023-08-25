import { Controller, Get, Body, Patch, Param, Delete ,Query, Post, UseGuards ,Request } from '@nestjs/common';
import { ApiTags ,ApiOperation ,ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserStateDto ,UpdateUserAvatarDto } from './dto/update-user.dto';
import { apiAmendFormat } from 'src/shared/utils/api.util';
import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
import { SearchUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import * as fs from 'fs-extra';
import * as path from 'path';

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

      return apiAmendFormat(await this.userService.updateInfoById(user_id,{ name }))

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

      return apiAmendFormat(await this.userService.updateInfoById(user_id,{ nickname }))

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
        throw new BaseException(ResultCode.COMMON_PHONE_VERIFY,{})
      }
      
      return apiAmendFormat(await this.userService.updateInfoById(user_id,{ phone }))

    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }


  @Patch('up_state')
  @ApiOperation({ summary: '修改用户状态', description: '修改用户状态，0是正常1是被封禁' }) 
  async updateState(@Body() dto: UpdateUserStateDto) {
    try {
      return apiAmendFormat(await this.userService.updateInfoById(dto.id,{ state :dto.state }))
    } catch (error) {
      throw new BaseException(ResultCode.ERROR,{},error)
    }
  }

  @Patch('up_avatar')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '修改用户头像', description: '修改用户头像' }) 
  async updateAvatar(@Body() dto: UpdateUserAvatarDto ,@Request() req) {
    try {
      let user_id = req.user.id;
      let realUrl = null;
      const user_info = await this.userService.findById(user_id);
      if(!user_info){
        throw new BaseException(ResultCode.USER_NOT_EXISTS,{})
      }
      let avatar = user_info.avatar.toString()
      if(avatar){
        // 该地址未默认图片地址不允许删除
        if(avatar != '/images/nuser.png'){
          let httpUrlPattern = /(http|https):\/\/([\w.]+\/?)\S*/;
          if(!httpUrlPattern.test(avatar)){
            /**
             * 因为该项目以后可能用到七牛那么七牛返回的路径则是真实路径带有http的 所有带有http的图片非本地地址所以不走该方法
             * 因为此项目是typescript所以nest会自动解析文件最后转换成js所在目录则是dist
             * 所以dirname(require.main.filename);获取的真实路径是项目路径+/dist
             * 而本服务器静态资源在和dist同级中的public里，所以这块需要用path.join这样得到了项目的真实路径
             */
            let appDir = path.dirname(require.main.filename);
            appDir = path.join(appDir,'../');
            const dirUrl = path.join(appDir,'public'); 
            const avatarURL = path.normalize(avatar)
            realUrl =  dirUrl + avatarURL;
            /**
             * 这里之所以用这种方式连接是因为删除文件是重要的操作。假如用户通过恶意修改头像地址。存到数据库里的值是../../upload
             * 那么此时用path.join连接地址会导致去往上级根目录删除文件。就歇菜了
             * 提一句，这里一般存到数据库里的地址都是/uploads/*.img
             */
          }
        }
      }
      const result = await this.userService.updateInfoById(user_id,{ avatar :dto.avatar })
      if(realUrl && result){
        // 当修改成功的时候并且realUrl有值的时候才删除
        // 以上罗里吧嗦，仅为了保证服务器多一点存储空间，剔除掉不需要的图片
        fs.remove(realUrl)
      }
      return apiAmendFormat(result)
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
