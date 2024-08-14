// src\prisma\prisma-client.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClientService } from './prisma-client.service';

// モック設定
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      $connect: jest.fn(),
    })),
  };
});

describe('PrismaClientService - onModuleInit', () => {
  let service: PrismaClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaClientService],
    }).compile();

    service = module.get<PrismaClientService>(PrismaClientService);
  });

  it('should connect to the database', async () => {
    await service.onModuleInit(); // onModuleInitを実行
    expect(service.$connect).toHaveBeenCalled(); // $connectが呼び出されたことを確認
  });
});
