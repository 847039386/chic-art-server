import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsString ,IsBoolean} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleInfoDto  {
    // 索引id
    @IsString()
    @ApiProperty({ description: '角色id', type: String ,example:'_id' })
    id: String
    @IsString()
    @ApiProperty({ description: '角色名称', type: String ,example:'管理员' })
    name: String
    @IsString()
    @ApiProperty({ description: '描述', type: String ,example:'这是一条描述' })
    description: String
}

export class UpdateRoleAvailableDto {
    // 权限id
    @IsString()
    @ApiProperty({ description: '角色ID', type: String ,example:'_id' })
    id: string
    // 权限状态 true：开启 ，false：不开启
    @IsBoolean()
    @ApiProperty({ description: '角色状态', type: String ,example:true })
    available: boolean

}
