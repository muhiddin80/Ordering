import { IsEmail, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

export class updateUserDuo {
    @IsOptional()
    @IsString()
    @MinLength(4)
    name:string;

    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(10)
    password:string;
}