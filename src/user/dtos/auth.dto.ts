import { IsEmail, IsString, MinLength } from "class-validator"

export class SignupDto {
    @IsEmail()
    email: String
    
    @IsString() @MinLength(5)
    password: String
}