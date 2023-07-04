import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { encryptCredential } from 'src/shared/utils/cryptogram.util';
import { AccountService } from '../account/account.service';
import { ErrorCodes ,OperatorException ,BaseException } from 'src/shared/utils/base_exception.util';
import { User } from '../user/schema/user.schema';
import baseConfig from 'src/config/base.config';



interface IUserToken {
  _id:string,
  name:string,
}


@Injectable()
export class AuthService {

  constructor( private readonly jwtService: JwtService, private readonly accountService: AccountService,) {}


  // jwt 签证，颁发token 
  certificate(user: IUserToken) {
    const payload = { username: user.name, sub: user._id,  };
    const token = this.jwtService.sign(payload,{expiresIn: baseConfig.token_expiresIn});
    return token
  }

  // 实现前端无感刷新 token
  certificateRefresh(user: IUserToken ,accessToken) {
    const payload = { username: user.name, sub: user._id ,accessToken };
    const token = this.jwtService.sign(payload);
    this.jwtService.sign(payload,{expiresIn:'360 days'})
    return token
  }


  // 验证token 并找到里面的值
  verifyToken(token: string) {
    try {
      if(!token){
        throw new BaseException(ErrorCodes.AUTH_TOKEN_NOT,{})
      }
      return  this.jwtService.verify(token.replace('Bearer ', ''));
    } catch (error) {
      throw new BaseException(ErrorCodes.AUTH_TOKEN_ERROR,{})
    }
  }

  verifyToken1(token: string) {
    try {
      if(!token){
        throw new BaseException(ErrorCodes.AUTH_TOKEN_NOT,{})
      }
      return  this.jwtService.verify(token.replace('Bearer ', ''));
    } catch (error) {
      throw new BaseException(ErrorCodes.AUTH_TOKEN_ERROR,{})
    }
  }

}