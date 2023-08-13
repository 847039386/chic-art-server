import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { AuthService } from 'src/modules/auth/auth.service';
  import { UserService } from 'src/modules/user/user.service';
  import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
  import { allRouter } from 'src/shared/data/router.data';
  import { PermissionService } from 'src/modules/permission/permission.service';
  /**
   * @guard文件作用:守卫
   */
  
  @Injectable()
  export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
      private readonly authService: AuthService ,
      private readonly permissionService: PermissionService,
      private readonly userService: UserService,
      ) {
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
        // const pfam = await this.permissionService.apiVerify(req.path)
        // 当权限并未添加的时候直接通过权限
        const accessToken = req.get('Authorization');
        if(accessToken){
          const user = await this.authService.verifyToken(accessToken);
          return true
        }else{
          throw new BaseException(ResultCode.AUTH_TOKEN_NOT,{})
        }
      } catch (e) {
        throw new BaseException(ResultCode.ERROR,{},e)
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
  