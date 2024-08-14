// src\prisma\prisma-client.service.spec.ts

import { PrismaClientService } from './prisma-client.service';

describe('PrismaClientService', () => {
  let service: PrismaClientService;

  beforeEach(async () => {
    service = new PrismaClientService();
    jest.spyOn(service, '$connect').mockResolvedValue(undefined); // 解決値を undefined に設定
    jest.spyOn(service, '$disconnect').mockResolvedValue(undefined); // 解決値を undefined に設定
    jest.spyOn(service, 'cleanDatabase').mockResolvedValue([]); // cleanDatabase が解決されるとき、空の配列を返すように設定
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should connect when module is initialized', async () => {
    await service.onModuleInit();
    expect(service.$connect).toHaveBeenCalled();
  });

  it('should disconnect when module is destroyed', async () => {
    await service.onModuleDestroy();
    expect(service.$disconnect).toHaveBeenCalled();
  });

  it('should clean the database before module is destroyed', async () => {
    await service.cleanDatabase(); // cleanDatabase を実行
    expect(service.cleanDatabase).toHaveBeenCalled(); // cleanDatabase が呼ばれたかを検証
  });
});
