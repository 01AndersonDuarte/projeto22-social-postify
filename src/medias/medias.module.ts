import { Module } from '@nestjs/common';
import { MediasService } from './medias.service';
import { MediasController } from './medias.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MediasRepository } from './medias.repository';
import { PublicationsModule } from '../publications/publications.module';

@Module({
  imports: [PrismaModule, PublicationsModule],
  controllers: [MediasController],
  providers: [MediasService, MediasRepository],
})
export class MediasModule { }
