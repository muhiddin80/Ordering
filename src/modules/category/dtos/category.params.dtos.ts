import { Type } from "class-transformer";
import { IsPositive } from "class-validator";

export class categoryParamsDuo {
    @Type(()=>Number)
    @IsPositive()
    id:number;
}