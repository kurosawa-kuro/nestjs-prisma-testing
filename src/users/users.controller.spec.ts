// src/users/users.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '@/users/users.controller';
import { UsersService } from '@/users/users.service';
import { CreateUser, UpdateUser } from '@/users/user.model';
import { User } from '@/lib/types'; // User型をインポート

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            all: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
            updateAvatar: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUser: CreateUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      };
      const expectedResult: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      expect(await controller.create(createUser)).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createUser);
    });
  });

  describe('index', () => {
    it('should return an array of users', async () => {
      const expectedResult: User[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          avatar: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(service, 'all').mockResolvedValue(expectedResult);

      expect(await controller.index()).toBe(expectedResult);
      expect(service.all).toHaveBeenCalled();
    });
  });

  describe('show', () => {
    it('should return a user', async () => {
      const expectedResult: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'find').mockResolvedValue(expectedResult);

      expect(await controller.show(1)).toBe(expectedResult);
      expect(service.find).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUser: UpdateUser = { name: 'Jane Doe' };
      const expectedResult: User = {
        id: 1,
        name: 'Jane Doe',
        email: 'john@example.com',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

      expect(await controller.update(1, updateUser)).toBe(expectedResult);
      expect(service.update).toHaveBeenCalledWith(1, updateUser);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const expectedResult: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'destroy').mockResolvedValue(expectedResult);

      expect(await controller.remove(1)).toBe(expectedResult);
      expect(service.destroy).toHaveBeenCalledWith(1);
    });
  });

  // Note: Avatar upload test is not included as it requires more complex setup for file upload simulation
});
