// src/users/upload.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UploadController, generateRandomFileName } from './upload.controller';

jest.mock('@nestjs/platform-express', () => ({
  FileInterceptor: jest.fn().mockImplementation(() => ({
    intercept: jest.fn(),
  })),
}));

describe('UploadController', () => {
  let controller: UploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
    }).compile();

    controller = module.get<UploadController>(UploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should return the correct URL', () => {
      const mockFile = {
        filename: 'test-file.jpg',
      };
      const result = controller.uploadFile(mockFile as any);
      expect(result).toEqual({
        url: `http://localhost:8080/api/uploads/test-file.jpg`,
      });
    });
  });

  describe('getImage', () => {
    it('should call res.sendFile with correct arguments', async () => {
      const mockPath = 'test-image.jpg';
      const mockRes = {
        sendFile: jest.fn(),
      };
      await controller.getImage(mockPath, mockRes as any);
      expect(mockRes.sendFile).toHaveBeenCalledWith(mockPath, {
        root: 'uploads',
      });
    });
  });

  describe('generateRandomFileName', () => {
    it('should generate a filename with correct format', () => {
      const result = generateRandomFileName('test.jpg');
      expect(result).toMatch(/^[a-f0-9]{32}\.jpg$/);
    });
  });
});
