import { Type } from "class-transformer";
import { IsPositive, IsString } from "class-validator";

export class orderBodyDuo{
    @Type(()=>Number)
    @IsPositive()
    user_id:number;

    @IsString()
    product:string
}