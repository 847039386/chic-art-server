import {  IsString ,IsInt } from 'class-validator';
export class CreateCounterDto {
    @IsString()
    sequence_id:string
    @IsInt()
    sequence_value :number
}
