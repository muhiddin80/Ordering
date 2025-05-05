import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class createCategoryDto {
    @IsString()
    @MinLength(4)
    name:string;

    @IsOptional()
    @IsPositive()
    @Type(()=>Number)
    category_id:number;
}