import { Module } from '@nestjs/common';
import { UploadController } from './interface/upload.controller';
import { UploadService } from './app/upload.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    // Serve uploaded files under both /uploads and /api/uploads to match frontend needs
    ServeStaticModule.forRoot(
      {
        rootPath: join(process.cwd(), 'uploads'),
        serveRoot: '/uploads',
      },
      {
        rootPath: join(process.cwd(), 'uploads'),
        serveRoot: '/api/uploads',
      },
    ),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
