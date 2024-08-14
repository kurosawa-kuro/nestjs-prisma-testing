// test/users.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

// Internal modules
import { AppModule } from '@/app.module';
import { PrismaClientService } from '@/prisma/prisma-client.service';
import { CreateUser } from '@/users/user.model';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let prismaClientService: PrismaClientService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prismaClientService = app.get<PrismaClientService>(PrismaClientService); // 修正
  });

  afterAll(async () => {
    await prismaClientService.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    // Clean the database before each test
    await prismaClientService.user.deleteMany({});
    await prismaClientService.todo.deleteMany({});
  });

  it('/ (GET)', async () => {

    const response = await request(app.getHttpServer())
      .get('/')
      .expect(200);

    // expect(Array.isArray(response.body)).toBe(true);
    // expect(response.body.length).toBeGreaterThan(0);
    // expect(response.body[0]).toHaveProperty('id');
    // expect(response.body[0]).toHaveProperty('name');
    // expect(response.body[0]).toHaveProperty('email');
    // expect(response.body[0]).not.toHaveProperty('password');
  });
});
