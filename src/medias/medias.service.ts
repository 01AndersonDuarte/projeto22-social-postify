import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';

@Injectable()
export class MediasService {

  constructor(private readonly mediasRepository: MediasRepository){}
  
  async verifyMedia(title: string, username: string){
    const media = await this.mediasRepository.verifyMedia({title, username});
    if(media) throw new HttpException("Item já criado", HttpStatus.CONFLICT);
  }

  async create(createMediaDto: CreateMediaDto) {
    await this.verifyMedia(createMediaDto.title, createMediaDto.username);
    return await this.mediasRepository.create(createMediaDto);
  }

  async findAll() {
    return await this.mediasRepository.findAll();
  }

  async findMediaById(id: number) {
    const media = await this.mediasRepository.findMediaById(id);
    if(!media) throw new HttpException("Registro não encontrado", HttpStatus.NOT_FOUND);

    return media;
  }

  async update(id: number, updateMediaDto: UpdateMediaDto) {
    await this.verifyMedia(updateMediaDto.title, updateMediaDto.username);
    await this.findMediaById(id);

    return await this.mediasRepository.update(id, updateMediaDto);
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
