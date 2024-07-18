import { IsOptional, IsString, MaxLength, IsNotEmpty } from "class-validator"

export class UpdatePostDto {
    @IsOptional()
    @IsString({ message: 'Title should be a string' })
    @MaxLength(30, { message: 'Title\'s length should be less than 30' })
    @IsNotEmpty({ message: 'Title should not be empty' })
    title?: string

    @IsOptional()
    @IsString({ message: 'Content should be a string' })
    @MaxLength(140, { message: 'Content\'s length should be less than 140' })
    @IsNotEmpty({ message: 'Content should not be empty' })
    content?: string
}