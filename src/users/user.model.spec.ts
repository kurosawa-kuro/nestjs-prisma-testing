// src/users/user.model.spec.ts

import { validate } from 'class-validator';
import { CreateUser, UpdateUser } from './user.model';

describe('User Model', () => {
  describe('CreateUser', () => {
    it('should pass validation with valid data', async () => {
      const user = new CreateUser();
      user.name = 'John Doe';
      user.email = 'john@example.com';
      user.password = 'password123';

      const errors = await validate(user);
      expect(errors.length).toBe(0);
    });

    it('should fail validation with invalid name', async () => {
      const user = new CreateUser();
      user.name = '';  // Invalid: empty string
      user.email = 'john@example.com';
      user.password = 'password123';

      const errors = await validate(user);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });

    it('should fail validation with invalid email', async () => {
      const user = new CreateUser();
      user.name = 'John Doe';
      user.email = 'invalid-email';  // Invalid: not an email format
      user.password = 'password123';

      const errors = await validate(user);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should fail validation with short password', async () => {
      const user = new CreateUser();
      user.name = 'John Doe';
      user.email = 'john@example.com';
      user.password = '12345';  // Invalid: less than 6 characters

      const errors = await validate(user);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });
  });

  describe('UpdateUser', () => {
    it('should allow partial updates', async () => {
      const user = new UpdateUser();
      user.name = 'John Doe';  // Only updating name

      const errors = await validate(user);
      expect(errors.length).toBe(0);
    });

    it('should still validate provided fields', async () => {
      const user = new UpdateUser();
      user.email = 'invalid-email';  // Invalid: not an email format

      const errors = await validate(user);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });
  });
});