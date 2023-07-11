import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { BaseException, ResultCode } from 'src/shared/utils/base_exception.util';
  import { allRouter } from 'src/shared/data/router.data';
  /**
   * @guard文件作用:守卫
   */
  
  @Injectable()
  export class PermissionAuth {
    constructor() {

    }
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
      const res = context.switchToHttp().getResponse();
      try {
        // 获取token Authorization
        console.log(req.url)
        console.log(req.path)
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
  