import { Test, TestingModule } from '@nestjs/testing';
import { PrismaBaseService } from './prisma-base.service';
import { PrismaClientService } from '../prisma/prisma-client.service';
import { Inject } from '@nestjs/common';

// モックのPrismaClientService
const mockPrismaClientService = {
  modelName: {
    create: jest.fn(),
  },
};

// テスト用の具体的なサービスクラス
class TestService extends PrismaBaseService<any> {
  constructor(
    prisma: PrismaClientService,
    @Inject('modelName') modelName: string,
  ) {
    super(prisma, modelName);
  }
}

describe('PrismaBaseService - create', () => {
  let service: TestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestService,
        {
          provide: PrismaClientService,
          useValue: mockPrismaClientService,
        },
        {
          provide: 'modelName', // modelNameを提供するプロバイダ
          useValue: 'modelName',
        },
      ],
    }).compile();

    service = module.get<TestService>(TestService);
  });

  it('should create a new record', async () => {
    const attributes = { name: 'test' };
    const createdRecord = { id: 1, name: 'test' };

    // PrismaClientServiceのcreateメソッドをモックし、期待される結果を返すようにする
    mockPrismaClientService.modelName.create.mockResolvedValue(createdRecord);

    // PrismaBaseServiceのcreateメソッドを呼び出し、結果を確認する
    const result = await service.create(attributes);

    // 結果が期待通りであることを確認
    expect(result).toEqual(createdRecord);

    // PrismaClientServiceのcreateメソッドが正しい引数で呼ばれたことを確認
    expect(mockPrismaClientService.modelName.create).toHaveBeenCalledWith({
      data: attributes,
    });
  });
});
