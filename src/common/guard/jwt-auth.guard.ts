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
        const pfam = await this.permissionService.apiVerify(req.path)
        // 当权限并未添加的时候直接通过权限
        if(pfam.length == 0 ){
          return true;
        }else{
          const accessToken = req.get('Authorization');
          if(!accessToken){
            throw new BaseException(ResultCode.AUTH_TOKEN_ERROR,{})
          }else{
            const user = await this.authService.verifyToken(accessToken);
            const uid = user.sub;
            const u_urp = await this.userService.getUserURP(uid);
            const u_p = u_urp.permissions
            let verify = false;
            for (let index = 0; index < pfam.length; index++) {
              const element = pfam[index];
              for (let jndex = 0; jndex < u_p.length; jndex++) {
                const up_element = u_p[jndex];
                if(element._id == up_element._id.toString()){
                  verify = true;
                  break;
                }
              }
            }
            if(verify){
              return true
            }else{
              throw new BaseException(ResultCode.PERMISSION_NO,{})
              return false
            }
          }
        }
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
  