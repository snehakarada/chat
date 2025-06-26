import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthSerice', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthService],
      providers: [],
    }).compile();

    authService = app.get<AuthService>(AuthService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(authService).toBe('Hello World!');
    });
  });
});
