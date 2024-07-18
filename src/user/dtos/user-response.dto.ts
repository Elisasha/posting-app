import { Role } from "@prisma/client"
import { Exclude } from "class-transformer"

export class UserResponseDto {
    id: number
    email: string
    role: Role
    createdAt: Date
    updatedAt: Date
    
    @Exclude()
    password

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial)
    }
}