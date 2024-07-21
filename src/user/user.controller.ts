import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserOwnerGuard } from 'src/guards/user-owner.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { UserService } from './user.service';
import { RoleGuard } from 'src/guards/role.guard';


@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }
    
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    @Get()
    findAll(): Promise<UserResponseDto[]> {
        return this.userService.getAllUsers()
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, UserOwnerGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findUserById(id)
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, UserOwnerGuard)
    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateUserDto) {
        return this.userService.updateUser(id, body)
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, UserOwnerGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.userService.removeUser(id)
    }

}
