import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service'
import { RegisterDto } from '../dtos/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Post('/register')
    signup(@Body() body: RegisterDto) {
        return this.authService.signup(body)
    }
}
