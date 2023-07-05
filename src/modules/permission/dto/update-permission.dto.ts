import { PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './create-permission.dto';
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
