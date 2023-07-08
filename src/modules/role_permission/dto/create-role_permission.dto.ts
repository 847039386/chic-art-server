import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class CreateRolePermissionDto {
    // 角色ID
    @IsString()
    @ApiProperty({ description: '角色ID', type: String ,example:'role_id' })
    role_id: string
    // 权限ID
    @IsString()
    @ApiProperty({ description: '权限ID', type: String ,example:'permission_id' })
    permission_id: string
}

