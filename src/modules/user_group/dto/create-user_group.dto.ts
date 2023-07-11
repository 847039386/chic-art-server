import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsInt, IsString } from "class-validator"


export class CreateUserGroupDto {
    // 权限名称
    @IsString()
    @ApiProperty({ description: '组名称', type: String ,example:'管理组' })
    name: string
    // 描述
    @IsString()
    @ApiProperty({ description: '组描述', type: String ,example:'这是一个管理组下面应该都是管理员才对' })
    description: string
    // true：开启 ，false：不开启
    @IsBoolean()
    @ApiProperty({ description: '组状态', type: String ,example:true })
    available: boolean
    // 父节点，指向自己
    @IsString()
    @ApiProperty({ description: '权限父级，空就是顶级', type: String ,example:'' })
    parent_id ?: string
    // 组类型 0可访问1可授权
    @IsInt()
    @ApiProperty({ description: '组类型', type: Number ,example:0 })
    type: number
}
