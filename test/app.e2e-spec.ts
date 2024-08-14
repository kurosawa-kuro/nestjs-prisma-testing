// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from '@/app.module';
// import { PrismaClientService } from '@/prisma/prisma-client.service';

// describe('AppController (e2e)', () => {
//   let app: INestApplication;
//   let PrismaClientService: PrismaClientService;

//   beforeAll(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();

//     PrismaClientService = app.get<PrismaClientService>(PrismaClientService);
//   });

//   afterAll(async () => {
//     await PrismaClientService.$disconnect();
//     await app.close();
//   });

//   beforeEach(async () => {
//     // Clean the database before each test
//     await PrismaClientService.cleanDatabase();
//   });

//   it('/ (GET)', () => {
//     return request(app.getHttpServer())
//       .get('/')
//       .expect(200)
//       .expect('データベース接続に成功しました！');
//   });

//   // Add more test cases here
// });
