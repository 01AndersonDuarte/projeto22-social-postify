import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediasRepository {
  constructor(private readonly prisma: PrismaService) {}

  async verifyMedia(createMediaDto: CreateMediaDto) {
    return await this.prisma.media.findFirst({
      where: {
        title: createMediaDto.title,
        username: createMediaDto.username,
      },
    });
  }

  async createMedia(createMediaDto: CreateMediaDto) {
    return await this.prisma.media.create({
      data: createMediaDto,
    });
  }

  async findAllMedias() {
    return await this.prisma.media.findMany();
  }

  async findMediaById(id: number) {
    return this.prisma.media.findFirst({
      where: {
        id,
      },
    });
  }

  async updateMedia(id: number, updateMediaDto: UpdateMediaDto) {
    return await this.prisma.media.update({
      where: {
        id,
      },
      data: {
        title: updateMediaDto.title,
        username: updateMediaDto.username,
      },
    });
  }

  async removeMedia(id: number) {
    return await this.prisma.media.delete({
      where: { id },
    });
  }
}
