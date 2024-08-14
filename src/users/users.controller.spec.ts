import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '@prisma/client';  // Prisma Client から User 型をインポート
import { CreateUser, UpdateUser } from './user.model';

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
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should create a user', async () => {
    const createUser: CreateUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Password123!',
      avatar: '/path/to/avatar',
    };

    const expectedResult: User = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedpassword',
      avatar: '/path/to/avatar',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

    expect(await controller.create(createUser)).toBe(expectedResult);
  });

  it('should return all users', async () => {
    const expectedResult: User[] = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashedpassword',
        avatar: '/path/to/avatar',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    jest.spyOn(service, 'all').mockResolvedValue(expectedResult);

    expect(await controller.index()).toBe(expectedResult);
  });

  it('should return a single user', async () => {
    const expectedResult: User = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedpassword',
      avatar: '/path/to/avatar',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(service, 'find').mockResolvedValue(expectedResult);

    expect(await controller.show(1)).toBe(expectedResult);
  });

  it('should update a user', async () => {
    const updateUser: UpdateUser = {
      name: 'John Doe Updated',
      email: 'john.updated@example.com',
      password: 'UpdatedPassword123!',
    };

    const expectedResult: User = {
      id: 1,
      name: 'John Doe Updated',
      email: 'john.updated@example.com',
      password: 'updatedhashedpassword',
      avatar: '/updated/path/to/avatar',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

    expect(await controller.update(1, updateUser)).toBe(expectedResult);
  });

  it('should delete a user', async () => {
    const expectedResult: User = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedpassword',
      avatar: '/path/to/avatar',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(service, 'destroy').mockResolvedValue(expectedResult);

    expect(await controller.remove(1)).toBe(expectedResult);
  });
});
