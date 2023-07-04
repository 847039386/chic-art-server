import {  IsString ,IsInt ,IsDate ,IsObject} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose'
export class CreateAccountDto {
    @IsObject()
    user_id:Types.ObjectId
    @IsString()
    salt :string
    @IsString()
    identity_type :string
    @IsString()
    identifier :string
    @IsString()
    credential :string
}
