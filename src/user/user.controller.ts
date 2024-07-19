import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserOwnerGuard } from 'src/guards/user-owner.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { UserService } from './user.service';


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

    @Roles(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard, UserOwnerGuard)
    @Put(':id')
    update(@Param('id', ParseIntPipe) userId: number,
        @Body() body: UpdateUserDto) {
        return this.userService.updateUser(userId, body)
    }

    @Roles(Role.ADMIN, Role.USER)
    @UseGuards(AuthGuard, UserOwnerGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) userId: number) {
        return this.userService.removeUser(userId)
    }

}
