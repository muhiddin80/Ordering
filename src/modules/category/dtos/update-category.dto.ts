import { IsString, MinLength } from "class-validator";

export class UpdateCategoryDto {
    @IsString()
    @MinLength(4)
    name:string
}