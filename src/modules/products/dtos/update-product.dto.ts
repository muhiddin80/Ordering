import { IsInt, IsPositive, IsString, MinLength } from "class-validator";

export class updateProductDto {
    @IsString()
    @MinLength(4)
    name:string;

    @IsPositive()
    @IsInt()
    price:number;
}