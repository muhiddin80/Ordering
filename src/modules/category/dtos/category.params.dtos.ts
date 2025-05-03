import { Type } from "class-transformer";
import { IsInt, IsPositive } from "class-validator";

export class categoryParamsDuo {
    @Type(()=>Number)
    @IsPositive()
    id:number;
}