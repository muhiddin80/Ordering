import { Type } from "class-transformer";
import { IsInt, IsPositive } from "class-validator";

export class userParamsDuo {
    @Type(()=>Number)
    @IsPositive()
    id:number;
}