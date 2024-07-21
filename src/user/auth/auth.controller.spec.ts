import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';

const loginDto: LoginDto = { email: 'login@test.com', password: 'password' }
const registerDto: RegisterDto = { email: 'signup@test.com', password: 'password' };
const result = 'token'

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        signup: jest.fn().mockResolvedValue(result),
                        login: jest.fn().mockResolvedValue(result)
                    }
                }
            ]
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('signup', () => {
        it('should call authService.signup with correct parameters', async () => {
            await authController.signup(registerDto);
            expect(authService.signup).toHaveBeenCalledWith(registerDto);
        });

        it('should return the result from authService.signup', async () => {
            expect(await authController.signup(registerDto)).toBe(result);
        });
    });

    describe('login', () => {
        it('should call authService.login with correct parameters', async () => {
            await authController.login(loginDto);
            expect(authService.login).toHaveBeenCalledWith(loginDto);
        });

        it('should return the result from authService.login', async () => {
            expect(await authController.login(loginDto)).toBe(result);
        });
    });
});