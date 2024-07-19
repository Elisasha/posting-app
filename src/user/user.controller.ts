import { Controller, UseGuards, ParseIntPipe, Param, Request, Put, Body, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { Get } from '@nestjs/common'
import { UserResponseDto } from './dtos/user-response.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserOwnerGuard } from 'src/guards/user-owner.guard';


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
