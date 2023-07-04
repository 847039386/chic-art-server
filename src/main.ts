import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module';
import { RequestInterceptor } from './common/interceptors/request_log.interceptor'
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/base-exception.filter';
import { OperatorExceptionsFilter } from './common/filters/operator-exception.filter';
import { ResponseStartTime } from './common/middleware/res_start_time.middleware';
import { OperatorLogService } from './modules/operator_log/operator_log.service';
import { RequestLogService } from './modules/request_log/request_log.service';
import { join } from 'path';
import { JwtAuthGuard } from './common/guard/jwt-auth.guard';
import { AuthService } from './modules/auth/auth.service';

async function bootstrap() {

  // development production 
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  SwaggerModule.setup('doc', app, SwaggerModule.createDocument(app, new DocumentBuilder()
  .setTitle('Chic Art 别致的艺术')
  .setDescription('Chic Art 管理系统')
  .setVersion('1.0')
  .addBearerAuth()
  .build()));

  var authService = app.get<AuthService>(AuthService)
  var requestLogService = app.get<RequestLogService>(RequestLogService)
  var operatorLogService = app.get<OperatorLogService>(OperatorLogService) 
  app.useGlobalFilters(new AllExceptionsFilter() ,new HttpExceptionFilter(requestLogService) ,new OperatorExceptionsFilter(requestLogService,operatorLogService));
  app.useGlobalInterceptors(new RequestInterceptor(requestLogService,operatorLogService));
  app.useGlobalGuards(new JwtAuthGuard(authService))
  // 全局中间件
  app.use(new ResponseStartTime().use)
  // 静态路径
  app.useStaticAssets(join(__dirname, '..', 'public'));
  
  app.enableCors()

  await app.listen(3000);
}
bootstrap();
