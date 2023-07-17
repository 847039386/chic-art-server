import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class CreateUserGroupUserDto {
    // 角色ID
    @IsString()
    @ApiProperty({ description: '用户ID', type: String ,example:'user_id' })
    user_id: string
    // 权限ID
    @IsString()
    @ApiProperty({ description: '用户组ID', type: String ,example:'user_group_id' })
    user_group_id: string
}
