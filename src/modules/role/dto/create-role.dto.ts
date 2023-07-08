import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"


export class CreateRoleDto {
    // 角色名称
    @IsString()
    @ApiProperty({ description: '权限名称', type: String ,example:'查看请求日志' })
    name: String
    // 描述
    @IsString()
    @ApiProperty({ description: '权限名称', type: String ,example:'查看请求日志' })
    description: String
    // 是否可用
    @IsString()
    @ApiProperty({ description: '权限名称', type: String ,example:'查看请求日志' })
    available: boolean
}
