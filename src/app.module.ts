import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { AccountModule } from './modules/account/account.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RolePermissionModule } from './modules/role_permission/role_permission.module';
import { UserGroupModule } from './modules/user_group/user_group.module';
import { UserGroupRoleModule } from './modules/user_group_role/user_group_role.module';
import { UserGroupUserModule } from './modules/user_group_user/user_group_user.module';
import { OperatorLogModule } from './modules/operator_log/operator_log.module';
import { RequestLogModule } from './modules/request_log/request_log.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/company/company.module';
import { TagModule } from './modules/tag/tag.module';
import { CameraModule } from './modules/camera/camera.module';
import { FileModule } from './modules/file/file.module';
import { CompanyEmployeeModule } from './modules/company_employee/company_employee.module';
import { ProgressTemplateModule } from './modules/progress_template/progress_template.module';
import { ProjectOrderModule } from './modules/project_order/project_order.module';
import { ProjectOrderUserModule } from './modules/project_order_user/project_order_user.module';
import { MessageModule } from './modules/message/message.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/chicart'),
    AuthModule,
    UserModule,
    RoleModule,
    AccountModule,
    PermissionModule,
    RolePermissionModule,
    UserGroupModule,
    UserGroupRoleModule,
    UserGroupUserModule,
    OperatorLogModule,
    RequestLogModule,
    CompanyModule,
    TagModule,
    CameraModule,
    FileModule,
    CompanyEmployeeModule,
    ProgressTemplateModule,
    ProjectOrderModule,
    ProjectOrderUserModule,
    MessageModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


