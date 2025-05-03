import { IsEmail, IsString, MaxLength, Min, MinLength } from "class-validator";

export class RegisteruserDuo {
    @IsString()
    @MinLength(4)
    name:string;

    @IsString()
    @IsEmail()
    email:string;

    @IsString()
    @MinLength(4)
    @MaxLength(10)
    password:string;
}