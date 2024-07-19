import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from '../dtos/auth.dto';
import { LoginDto } from '../dtos/auth.dto';

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
            signup: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signup', () => {
    it('should call authService.signup with correct parameters', async () => {
      const signupSpy = jest.spyOn(authService, 'signup');
      const registerDto: RegisterDto = { email: 'testuser', password: 'testpass' };

      await authController.signup(registerDto);

      expect(signupSpy).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should call authService.login with correct parameters', async () => {
      const loginSpy = jest.spyOn(authService, 'login');
      const loginDto: LoginDto = { email: 'testuser', password: 'testpass' };

      await authController.login(loginDto);

      expect(loginSpy).toHaveBeenCalledWith(loginDto);
    });
  });
});