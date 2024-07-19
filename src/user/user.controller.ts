import { Controller, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Get } from '@nestjs/common'
import { UserResponseDto } from './dtos/user-response.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';


@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }
    
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard)
    @Get()
    findAll(): Promise<UserResponseDto[]> {
        return this.userService.getAllUsers()
    }

    @Roles(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard, UserOwnerGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findUserById(id)
    }




}
