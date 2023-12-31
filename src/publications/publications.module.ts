import { Module } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { PublicationsRepository } from './publications.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PublicationsController],
  providers: [PublicationsService, PublicationsRepository],
  exports: [PublicationsService],
})
export class PublicationsModule {}
