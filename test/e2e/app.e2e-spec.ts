import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

// Internal modules
import { AppModule } from '@/app/modules/app.module';
import { PrismaClientService } from '@/orm/prisma-client.service';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let prismaClientService: PrismaClientService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prismaClientService = app.get<PrismaClientService>(PrismaClientService);
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
    const response = await request(app.getHttpServer()).get('/').expect(200);

    // Check if the response is a string
    expect(typeof response.text).toBe('string');

    // Check if the response contains the expected message
    expect(response.text).toContain('データベース接続に成功しました！');
  });

  // You can add more test cases for other endpoints here
});
