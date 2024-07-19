import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Post('/register')
    signup(@Body() body: RegisterDto) {
        return this.authService.signup(body)
    }

    @Post('/login')
    login(@Body() body: LoginDto) {
        return this.authService.login(body)
    }
}
