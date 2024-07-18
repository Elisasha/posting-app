import {
    Controller, Post, Get, Put, Delete
} from '@nestjs/common';

@Controller('posts')
export class PostController {
    @Post()
    create() {
        return { 'new obj': 'obj'}
    }

    @Get()
    findAll() {
        return []
    }

    @Get(':id')
    findOne() {
        return {'exist obj': 'obj'}
    }

    @Put(':id')
    update() {
    }

    @Delete(':id')
    remove() {    
    }

}
