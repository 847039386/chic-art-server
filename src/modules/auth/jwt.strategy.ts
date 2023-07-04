import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import BaseConfig from 'src/config/base.config';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: BaseConfig.secret,
    });
  }
  
  // JWT验证 - Step 4: 被守卫调用
  async validate(payload: any) {
    return { id: payload.sub, username: payload.username };
  }
}