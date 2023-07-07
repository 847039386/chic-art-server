import { Types } from 'mongoose';
import { PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './create-permission.dto';
import { PermissionType } from '../schema/permission.schema'
import {  IsString ,IsInt ,IsDate ,IsObject ,IsBoolean ,IsEnum} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePermissionAvailableDto {
     // 权限id
     @IsString()
     @ApiProperty({ description: '权限ID', type: String ,example:'_id' })
     id: string
     // 权限状态 true：开启 ，false：不开启
     @IsBoolean()
     @ApiProperty({ description: '权限状态', type: String ,example:true })
     available: boolean

}

export class UpdatePermissionDto {
     // 权限id
     @IsString()
     @ApiProperty({ description: '权限ID', type: String ,example:'_id' })
     id ?: string
     // 权限名称
     @IsString()
     @ApiProperty({ description: '权限名称', type: String ,example:'查看请求日志' })
     name: string
     // 描述
     @IsString()
     @ApiProperty({ description: '权限描述', type: String ,example:'是否可以查看日志' })
     description: string
     @IsEnum(PermissionType)
     @ApiProperty({ description: '权限类型API、MENU、BTN', type: String ,example:'API' })
     type: PermissionType
     // 权限代码
     @IsString()
     @ApiProperty({ description: '权限代码，类型为API时候可指路由*为通配符', type: String ,example:'/api*' })
     code: string
}
