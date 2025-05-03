import { IsInt, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class createProductDuo {
    @IsString()
    @MinLength(4)
    name:string;

    @IsPositive()
    @IsInt()
    price:number;

    @IsPositive()
    @IsInt()
    category_id:number;
}