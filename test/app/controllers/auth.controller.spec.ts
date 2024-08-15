import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@/app/controllers/auth.controller';
import { AuthService } from '@/app/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { CreateUser } from '@/app/models/auth.model';
import { AuthGuard } from '@/app/guards/auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            getCurrentUser: jest.fn(),
            logout: jest.fn((response: Response) =>
              response.clearCookie('jwt'),
            ), // Ensure logout is performing action
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: AuthGuard,
          useValue: {
            canActivate: jest.fn(() => true),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should call AuthService.register with RegisterDto', async () => {
      const dto = new CreateUser();
      dto.name = 'John Doe';
      dto.email = 'john@example.com';
      dto.password = 'password';
      dto.passwordConfirm = 'password';

      const expectedUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        avatar: null,
        role: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(authService, 'register').mockResolvedValue(expectedUser);
      expect(await controller.register(dto)).toEqual(expectedUser);
      expect(authService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should set cookie and return user', async () => {
      const mockResponse = { cookie: jest.fn() } as unknown as Response;
      const loginResult = { user: { id: 1, name: 'John Doe' }, token: 'token' };

      jest.spyOn(authService, 'login').mockResolvedValue(loginResult);
      expect(
        await controller.login('email@example.com', 'password', mockResponse),
      ).toEqual(loginResult.user);
      expect(authService.login).toHaveBeenCalledWith(
        'email@example.com',
        'password',
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith('jwt', 'token', {
        httpOnly: true,
      });
    });
  });

  describe('user', () => {
    it('should call AuthService.getCurrentUser and return result', async () => {
      const req = {
        user: { id: 1 },
        headers: {},
        params: {},
        query: {},
      } as unknown as Request;
      const expectedUser = { id: 1, name: 'John Doe' };
      jest.spyOn(authService, 'getCurrentUser').mockResolvedValue(expectedUser);

      expect(await controller.user(req)).toEqual(expectedUser);
      expect(authService.getCurrentUser).toHaveBeenCalledWith(req);
    });
  });

  describe('logout', () => {
    it('should call AuthService.logout and return success message', async () => {
      const mockResponse = { clearCookie: jest.fn() } as unknown as Response;

      // Ensure no clearCookie has been called before the actual test action
      expect(mockResponse.clearCookie).not.toHaveBeenCalled();

      // Directly testing the AuthService to ensure it's behaving as expected
      authService.logout(mockResponse);
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('jwt');

      // Now testing through the controller
      await controller.logout(mockResponse);

      // Ensuring that the AuthService's logout function is being invoked correctly from the controller
      expect(authService.logout).toHaveBeenCalledWith(mockResponse);

      // This check is redundant but serves as a double confirmation
      expect(mockResponse.clearCookie).toHaveBeenCalledTimes(2);
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('jwt');
    });
  });
});
