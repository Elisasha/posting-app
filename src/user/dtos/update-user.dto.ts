import { Role } from "@prisma/client"
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    email?: string
    
    @IsOptional()
    @IsString()
    @MinLength(5)
    password?: string;
}