import { Module ,forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import baseConfig from 'src/config/base.config';
import { AccountModule } from '../account/account.module';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  exports: [AuthService],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: baseConfig.secret,
      // signOptions: { expiresIn: '8h' }, // token 过期时效
    }),
    forwardRef(() => AccountModule),
    UserModule
  ],
})
export class AuthModule {}

 