// test\mock-factories.ts

// External libraries
import { Todo } from '@prisma/client';

// Internal modules
import { User } from '../src/lib/types';


export const createMockUser = (override: Partial<User> = {}): User => ({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...override,
});

export const createMockTodo = (override: Partial<Todo> = {}): Todo => ({
  id: 1,
  title: 'Test Todo',
  userId: 1,
  ...override,
});
