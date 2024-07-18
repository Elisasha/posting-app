export class PostResponseDto {
    id: number
    title: string
    content: string
    userId: number
    createdAt: Date
    updatedAt: Date

    constructor(partial: Partial<PostResponseDto>) {
        Object.assign(this, partial)
    }
}