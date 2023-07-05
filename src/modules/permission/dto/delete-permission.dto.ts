import {  IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeletePermissionDto {
    // 权限名称
    @IsString()
    @ApiProperty({ description: '权限id', type: String ,example:'_id' })
    id: string
}
