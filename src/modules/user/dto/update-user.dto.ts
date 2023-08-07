import { IsString ,IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserStateDto {
    // 用户id
    @IsString()
    @ApiProperty({ description: '权限ID', type: String ,example:'_id' })
    id: string
    // 权限状态 true：开启 ，false：不开启
    @IsBoolean()
    @ApiProperty({ description: '权限状态', type: String ,example:true })
    state: boolean    
}


export class UpdateUserNameDto {
    @IsString()
    @ApiProperty({ description: '用户名称', type: String ,example:'_id' })
    name: string
}

export class UpdateUserPhoneDto {
    @IsString()
    @ApiProperty({ description: '用户名称', type: String ,example:'_id' })
    phone: string
}

