// src/users/users.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '@/users/users.controller';
import { UsersService } from '@/users/users.service';
import { CreateUser, UpdateUser } from '@/users/user.model';

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
            findBy: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
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
        password: 'password123',
      };
      const expectedResult = { id: 1, ...createUser };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      expect(await controller.create(createUser)).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createUser);
    });
  });

  describe('index', () => {
    it('should return an array of users', async () => {
      const expectedResult = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
      ];

      jest.spyOn(service, 'all').mockResolvedValue(expectedResult);

      expect(await controller.index()).toBe(expectedResult);
      expect(service.all).toHaveBeenCalled();
    });
  });

  describe('show', () => {
    it('should return a user', async () => {
      const expectedResult = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      };

      jest.spyOn(service, 'findBy').mockResolvedValue(expectedResult);

      expect(await controller.show(1)).toBe(expectedResult);
      expect(service.findBy).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUser: UpdateUser = { name: 'Jane Doe' };
      const expectedResult = {
        id: 1,
        name: 'Jane Doe',
        email: 'john@example.com',
      };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

      expect(await controller.update(1, updateUser)).toBe(expectedResult);
      expect(service.update).toHaveBeenCalledWith(1, updateUser);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const expectedResult = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      };

      jest.spyOn(service, 'destroy').mockResolvedValue(expectedResult);

      expect(await controller.remove(1)).toBe(expectedResult);
      expect(service.destroy).toHaveBeenCalledWith(1);
    });
  });
});
