import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginUserDuo {
    @IsString()
    @MinLength(4)
    @MaxLength(10)
    password:string;

    @IsString()
    @IsEmail()
    email:string;
}