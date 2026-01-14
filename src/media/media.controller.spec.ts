import { Test, TestingModule } from '@nestjs/testing';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

const mockedMediaService = {
  uploadFile: jest.fn(),
};

describe('MessageMediaController', () => {
  let controller: MediaController;
  let service: jest.Mocked<MediaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaController],
      providers: [
        {
          provide: MediaService,
          useValue: mockedMediaService,
        },
      ],
    }).compile();

    controller = module.get<MediaController>(MediaController);
    service = module.get(MediaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('upload', () => {
    it('should upload file and return file info', async () => {
      const mockFile = {
        originalname: 'test.png',
        mimetype: 'image/png',
        buffer: Buffer.from('fake-content'),
      } as Express.Multer.File;

      service.uploadFile.mockResolvedValue({
        file: {
          Location: 'https://cdn.example.com/test.png',
        },
        type: 'image',
      } as any);

      const result = await controller.upload(mockFile);

      expect(service.uploadFile).toHaveBeenCalledTimes(1);
      expect(service.uploadFile).toHaveBeenCalledWith(mockFile);

      expect(result).toEqual({
        message: 'file uploaded successfully',
        file: 'https://cdn.example.com/test.png',
        type: 'image',
      });
    });
  });
});
