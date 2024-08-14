// src\prisma\prisma-client.service.spec.ts

import { PrismaClientService } from './prisma-client.service';

describe('PrismaClientService', () => {
  let service: PrismaClientService;

  beforeEach(async () => {
    service = new PrismaClientService();
    jest.spyOn(service, '$connect'); // PrismaClient の $connect メソッドをスパイします
  });

  afterEach(async () => {
    jest.clearAllMocks(); // モックをクリア
  });

  it('should connect when module is initialized', async () => {
    await service.onModuleInit(); // onModuleInit を実行
    expect(service.$connect).toHaveBeenCalled(); // $connect が呼ばれたかを検証
  });
});
