import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { PublicationsModule } from '../publications/publications.module';

@Module({
  imports: [PrismaModule, PublicationsModule],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
})
export class PostsModule {}
