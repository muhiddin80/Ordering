import { Transform, Type } from "class-transformer";
import { IsPositive } from "class-validator";

export class orderParamsDuo {
    @Type(()=>Number)
    @IsPositive()
    id:number;
}