import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"


export class CreateUserGroupRoleDto {
    // 角色ID
    @IsString()
    @ApiProperty({ description: '角色ID', type: String ,example:'role_id' })
    role_id: string
    // 权限ID
    @IsString()
    @ApiProperty({ description: '用户组ID', type: String ,example:'user_group_id' })
    user_group_id: string
}
