import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class ResponseStartTime implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    res.setHeader('response-start-time',Date.now())
    setTimeout(() => {
      next();
    }, 500);
    // next();
  }
}
