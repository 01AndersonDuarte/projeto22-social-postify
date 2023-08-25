import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';
import { PublicationsService } from '../publications/publications.service';

@Injectable()
export class MediasService {

  constructor(private readonly mediasRepository: MediasRepository,
    private readonly publicationsService: PublicationsService){}

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

  async remove(id: number) {
    const media = await this.findMediaById(id);
    const publication = await this.publicationsService.findPublicationByMediaId(media.id);
    if(publication) throw new HttpException("Publicação já criada!", HttpStatus.FORBIDDEN);
    
    return this.mediasRepository.remove(id);
  }
}
