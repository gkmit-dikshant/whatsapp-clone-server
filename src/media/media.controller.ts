import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const { file: uploadedFile, type } =
      await this.mediaService.uploadFile(file);
    return {
      message: 'file uploaded successfully',
      file: uploadedFile.Location,
      type,
    };
  }
}
