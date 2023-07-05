import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { NestFactory } from '@nestjs/core';
  import { AuthGuard } from '@nestjs/passport';
  import { AuthService } from 'src/modules/auth/auth.service';
  import { UserService } from 'src/modules/user/user.service';
  import { NestExpressApplication } from '@nestjs/platform-express';
  import { AppModule } from 'src/app.module';
  import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
  import { allRouter } from 'src/shared/data/router.data';
  /**
   * @guard文件作用:守卫
   */
  
  @Injectable()
  export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly authService: AuthService) {
      super()
    }
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
      const res = context.switchToHttp().getResponse();
      /**
       * @如果白名单数组中存在路径
       */
      if (this.hasUrl(this.urlList, req.path)) return true;
      
      try {
        // 获取token Authorization
        const accessToken = req.get('Authorization');
        if(!accessToken){
          throw new BaseException(ResultCode.AUTH_TOKEN_ERROR,{})
        }else{
          const user = await this.authService.verifyToken(accessToken);
          console.log(user,'??????')
          // console.log(req.user,'aaaaaaa')
        }
        
        // if (!accessToken) throw new UnauthorizedException('请先登录');

        // 获取id
        // @ts-ignore
        // const app = await NestFactory.create<NestExpressApplication>(AppModule);
        // const authService = app.get(AuthService);
        // const userService = app.get(UserService);
        // const user = await authService.verifyToken(accessToken);
        // if (Object.keys(user).length > 0) {
        //   const resData = await userService.userfindOne(user.sub);
        //   if (resData.code === 200) return true;
        // }
        return true
      } catch (e) {
        throw new BaseException(ResultCode.ERROR,{},e)
        return false;
      }
    }
    // 白名单数组
    private urlList: string[] = allRouter
  
    // 验证该次请求是否为白名单内的路由
    private hasUrl(urlList: string[], url: string): boolean {
      let flag = false;
      if (urlList.indexOf(url) !== -1) {
        flag = true;
      }
      return flag;
    }
  }
  