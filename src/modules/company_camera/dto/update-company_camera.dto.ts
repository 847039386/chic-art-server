import { ApiProperty } from '@nestjs/swagger';
import {  IsString ,IsArray } from 'class-validator';

export class UpdateCompanyCameraDto  {

}


export class UpdateCompanyCameraExpireTimeDto {
    // 公司ID
    @IsString()
    @ApiProperty({ description: '公司监控ID', type: String ,example:'公司监控ID' })
    id: string
    // 时间
    @IsString()
    @ApiProperty({ description: '时间', type: String ,example:'时间' })
    expire_time: String
}
