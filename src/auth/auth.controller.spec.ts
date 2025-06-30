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

  // describe('root', () => {
  //   it('should give false', () => {
  //     const res = {
  //       cookie: jest.fn(),
  //     };
  //     authService.expect(createSession('superman', res)).toB;
  //   });
  // });

  describe('authService.createSession', () => {
    it('should create a session, set a cookie, and return "done"', () => {
      // Arrange: mock the response object
      const res = {
        cookie: jest.fn(),
      };

      // Act: call the function
      const result = authService.createSession('superman', res);

      // Assert: returned value
      expect(result).toBe('done');
    });
  });
});
