import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { PermissionSchema } from './schema/permission.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService],
  imports: [
    MongooseModule.forFeature([{ name: 'Permission', schema: PermissionSchema }]),
  ]
})
export class PermissionModule {}
