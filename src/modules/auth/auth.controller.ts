import { Controller, Get, Post, Body, Patch, Param, Delete ,UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiTags ,ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AccountService } from '../account/account.service';
import { encryptCredential, makeSalt } from 'src/shared/utils/cryptogram.util';
import { OperatorException ,BaseException ,ErrorCodes } from 'src/shared/utils/base_exception.util';
import { apiAmendFormat } from 'src/common/decorators/api.decorator';
import { UserService } from '../user/user.service'
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/schema/user.schema';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('api/auth')
@ApiTags('登陆验证与注册') 
export class AuthController {

  constructor(private readonly accountService: AccountService ,private readonly authService :AuthService ,private readonly userService :UserService) {}

  /**
   * 每次登陆后都会获得两个token,accessToken和refreshToken
   * accessToken用来验证，而refreshToken用来刷新，refreshToken解析后会获取accessToken的值
   * 在解析accessToken会获取到原来的签发信息
   * 当此API调用后。同样会签发这两个token用来替换前端的原token，
   * 前端在每次请求前会先判定当前token是否过期，如过期后会调用这个api刷新新的token 从而实现无感刷新
   */
  @Post('refresh-token') 
  @ApiBody({ type :RefreshTokenDto })
  @ApiOperation({ summary: '刷新token' ,description:'登陆后会获取两个token，一个用来请求，一个用来刷新，'}) 
  async refreshToken(@Body() body :RefreshTokenDto) {
    
    // 刷新token值
    const refresh_token = body.refreshToken;
    // 解析RefreshToken
    const payload = this.authService.verifyToken(refresh_token)
    // 签发一个新token，
    const accessToken = this.authService.certificate({_id:payload.sub ,name :payload.username})
    // 获取新token里的值
    const newPayload = this.authService.verifyToken(accessToken)
    // 签发一个刷新token，
    const refreshToken = this.authService.certificateRefresh({_id:payload.sub ,name :payload.username},accessToken)
    
    return apiAmendFormat({ 
      accessToken,
      refreshToken,
      expires :newPayload.exp
    })

  }

  @Post('login') 
  @ApiBody({type :LoginDto})
  @ApiOperation({ summary: '登陆本站账号'}) 
  async login(@Body() body :LoginDto) {
    const identifier = body.username;
    const credential = body.password
    try {
      const account = await this.accountService.findOne({ identifier });
      if (account) {
        const user_id = account.user_id;
        const hashedPassword = account.credential;
        const salt = account.salt;
        const hashPassword = encryptCredential(credential, salt);
        if (hashedPassword === hashPassword) {
          const accessToken = this.authService.certificate({_id:user_id._id ,name:user_id.name.toString()})
          const refreshToken = this.authService.certificateRefresh({_id:user_id._id ,name :user_id.name.toString()},accessToken)
          const payload = this.authService.verifyToken(accessToken)
          console.log(payload)
          return apiAmendFormat({ 
            username: user_id.name, 
            avatar:user_id.avatar ,
            accessToken,
            refreshToken,
            expires :payload.exp
          },{
            isSaveOperator:true,
            operator:{
              user_id :user_id._id,
              type :'登陆',
              module:'账户',
              subject:'本站',
              description:'本站账号登陆'
            }
          })
        } else {
          // 密码错误
          throw new OperatorException(ErrorCodes.ACCOUNT_PASSWORD_ERROR,{
            operatorType:'登陆',
            module :'账户',
            subject : '本站',
            description :'密码错误',
          },{isSaveOperator:true})
          
        }
      }else{
        throw new BaseException(ErrorCodes.ACCOUNT_USERNAME_NOT,{})
      }
    } catch (error) {
      throw new BaseException(ErrorCodes.ERROR,{},error)
    }
  }

  @Post('register')
  @ApiBody({ type: RegisterDto }) 
  @ApiOperation({ summary: '注册本站账号'}) 
  async register(@Body() body :RegisterDto) {
    const name = body.name;
    const avatar = body.avatar;
    const identifier = body.identifier;
    const credential = body.credential
    const r_credential = body.r_credential
    let salt ,user ,acco ,account ,user_id ,hash_credential;

    // 账号正则：6至20位，以字母开头，字母，数字，减号，下划线
    var identifierPattern = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/;
    // 密码正则： 至少包含字母、数字，6-16位
    var credentialPattern = /^(?=.*[a-zA-Z])(?=.*\d).{6,16}$/;
    try {
      if(credential != r_credential){
        throw new BaseException(ErrorCodes.ACCOUNT_PASSWORD_DIFF,{})
      }

      if(!identifierPattern.test(identifier)){
        throw new BaseException(ErrorCodes.ACCOUNT_USERNAME_FORMAT_ERROR,{})
      }

      if(!credentialPattern.test(credential)){
        throw new BaseException(ErrorCodes.ACCOUNT_PASSWORD_FORMAT_ERROR,{})
      }

      acco = await this.accountService.findOne({identifier , identity_type:'username'})
      if(acco){
        throw new BaseException(ErrorCodes.ACCOUNT_USERNAME_REPEAT,{})
      }else{
        user = await this.userService.create({ name :name ,avatar})
        user_id = user._id
        salt = makeSalt()
        hash_credential = encryptCredential(credential,salt)
        account = await this.accountService.create({ user_id ,identity_type :'username' ,identifier ,credential:hash_credential ,salt })
      }
    } catch (error) {
      throw new BaseException(ErrorCodes.ERROR,{},error)
    } 
    return apiAmendFormat({ name ,avatar },{
      isSaveOperator:true,
      operator:{
        user_id :user_id._id,
        type :'注册',
        module:'账户',
        subject:'本站',
        description:'注册本站用户'
      }
    })
  }

}



