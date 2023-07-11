import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsInt, IsString } from "class-validator"

export class UpdateUserGroupInfoDto{
    @IsString()
    @ApiProperty({ description: '组id', type: String ,example:'查看请求日志' })
    id: string
    // 权限名称
    @IsString()
    @ApiProperty({ description: '组名称', type: String ,example:'查看请求日志' })
    name: string
    // 描述
    @IsString()
    @ApiProperty({ description: '组描述', type: String ,example:'是否可以查看日志' })
    description: string
    // 权限类型 0是可访问 1是可授权
    @IsInt()
    @ApiProperty({ description: '组类型', type: Number ,example:0 })
    type: number
}


export class UpdateUserGroupAvailableDto {
    @IsString()
    @ApiProperty({ description: '组id', type: String ,example:'查看请求日志' })
    id: string
    // 状态名称
    @IsBoolean()
    @ApiProperty({ description: '组状态', type: String ,example:true })
    available: boolean
}