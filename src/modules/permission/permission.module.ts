import { Module ,forwardRef } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { PermissionSchema } from './schema/permission.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RolePermissionModule } from '../role_permission/role_permission.module';

@Module({
  exports:[PermissionService],
  controllers: [PermissionController],
  providers: [PermissionService],
  imports: [
    MongooseModule.forFeature([{ name: 'Permission', schema: PermissionSchema }]),
    forwardRef(() => RolePermissionModule)
  ]
})
export class PermissionModule {}
