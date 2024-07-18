import { IsEmail, IsString, MinLength } from "class-validator"

export class RegisterDto {
    @IsEmail()
    email: string
    
    @IsString() @MinLength(5)
    password: string
}