import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';

@Injectable()
export class MediasService {

  constructor(private readonly mediasRepository: MediasRepository){}

  async create(createMediaDto: CreateMediaDto) {
    const media = await this.mediasRepository.findMedia(createMediaDto);
    if(media!==null) {
      throw new HttpException("Item já criado", HttpStatus.CONFLICT);
    }
    await this.mediasRepository.create(createMediaDto);
  }

  async findAll() {
    return await this.mediasRepository.findAll();
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
