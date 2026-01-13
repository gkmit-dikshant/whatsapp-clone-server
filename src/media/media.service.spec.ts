import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from './media.service';
import { ConfigService } from '@nestjs/config';

const mockedConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'AWS_S3_BUCKET') return 'test-bucket';
    if (key === 'S3_ACCESS_KEY_ID') return 'access_key';
    if (key === 'S3_SECRET_ACCESS_KEY') return 'secret_access';
    return null;
  }),
  getOrThrow: jest.fn((key: string) => {
    if (key === 'S3_REGION') return 'ap-south-1';
    return null;
  }),
};

describe('MediaService', () => {
  let service: MediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
