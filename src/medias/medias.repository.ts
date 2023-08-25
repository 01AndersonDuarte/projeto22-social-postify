import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediasRepository {

  constructor(private readonly prisma: PrismaService){}

  async findMedia(createMediaDto: CreateMediaDto){
    return await this.prisma.media.findFirst({
      where: {
        title: createMediaDto.title,
        username: createMediaDto.username
      }
    });
  }

  async create(createMediaDto: CreateMediaDto) {
    return await this.prisma.media.create({
      data: createMediaDto
    });
  }

  async findAll() {
    return await this.prisma.media.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} media`;
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
