import { IsNotEmpty, IsString, MaxLength } from "class-validator"

export class CreatePostDto {
    @IsString({ message: 'Should be a string' })
    @MaxLength(30, { message: 'Title\'s length should be less than 140' })
    @IsNotEmpty({ message: 'Should not be empty' })
    title: string

    @IsString({ message: 'Should be a string' })
    @MaxLength(140, { message: 'Title\'s length should be less than 140' })
    @IsNotEmpty({ message: 'Should not be empty' })
    content: string
}