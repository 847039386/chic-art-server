import { IsString ,IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserStateDto {
    // 用户id
    @IsString()
    @ApiProperty({ description: '权限ID', type: String ,example:'_id' })
    id: string
    // 用户状态0正常 1，封禁
    @IsBoolean()
    @ApiProperty({ description: '权限状态', type: String ,example:0 })
    state: number    
}

export class UpdateUserAvatarDto {
    // 图像地址
    @IsBoolean()
    @ApiProperty({ description: '图像地址', type: String ,example:'url' })
    avatar: string    
}


