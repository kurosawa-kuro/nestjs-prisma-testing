// src/users/upload.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UploadController, generateRandomFileName } from './upload.controller';
import { Express } from 'express';
import { Readable } from 'stream';

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
    it('should upload a file and return the URL', async () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'image',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 12345,
        destination: './uploads',
        filename: 'randomfilename.jpg',
        path: 'uploads/randomfilename.jpg',
        buffer: Buffer.from('test file content'),
        stream: new Readable(),
      };

      const result = await controller.uploadFile(mockFile);

      expect(result).toEqual({
        url: `http://localhost:8080/api/uploads/${mockFile.filename}`,
      });
    });
  });

  describe('getImage', () => {
    it('should send the file', async () => {
      const mockPath = 'testimage.jpg';
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
    it('should generate a random file name with correct extension', () => {
      const originalName = 'test.jpg';
      const result = generateRandomFileName(originalName);

      expect(result).toMatch(/^[0-9a-f]{32}\.jpg$/);
    });

    it('should generate different file names for multiple calls', () => {
      const originalName = 'test.png';
      const result1 = generateRandomFileName(originalName);
      const result2 = generateRandomFileName(originalName);

      expect(result1).not.toEqual(result2);
      expect(result1).toMatch(/^[0-9a-f]{32}\.png$/);
      expect(result2).toMatch(/^[0-9a-f]{32}\.png$/);
    });

    it('should handle file names without extensions', () => {
      const originalName = 'testfile';
      const result = generateRandomFileName(originalName);

      expect(result).toMatch(/^[0-9a-f]{32}$/);
    });
  });
});
