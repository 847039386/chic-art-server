import {  ApiProperty, } from "@nestjs/swagger";
import { IsString } from "class-validator";
export class CreateFileDto  {
    @IsString()
    @ApiProperty({ type: String, format: 'binary' })
    file: any
}