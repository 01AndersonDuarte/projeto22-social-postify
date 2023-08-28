import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';
import { PublicationsService } from '../publications/publications.service';

@Injectable()
export class MediasService {
  constructor(
    private readonly mediasRepository: MediasRepository,
    @Inject(forwardRef(() => PublicationsService))
    private publicationsService: PublicationsService,
  ) {}

  async verifyMedia(title: string, username: string) {
    const media = await this.mediasRepository.verifyMedia({ title, username });
    if (media) throw new HttpException('Item já criado', HttpStatus.CONFLICT);
  }

  async createMedia(createMediaDto: CreateMediaDto) {
    await this.verifyMedia(createMediaDto.title, createMediaDto.username);
    return await this.mediasRepository.createMedia(createMediaDto);
  }

  async findAllMedias() {
    return await this.mediasRepository.findAllMedias();
  }

  async findMediaById(id: number) {
    const media = await this.mediasRepository.findMediaById(id);
    if (!media)
      throw new HttpException('Registro não encontrado', HttpStatus.NOT_FOUND);

    return media;
  }

  async updateMedia(id: number, updateMediaDto: UpdateMediaDto) {
    await this.findMediaById(id);
    await this.verifyMedia(updateMediaDto.title, updateMediaDto.username);

    return await this.mediasRepository.updateMedia(id, updateMediaDto);
  }

  async removeMedia(id: number) {
    const media = await this.findMediaById(id);
    const publication = await this.publicationsService.findPublicationByMediaId(
      media.id,
    );
    if (publication)
      throw new HttpException('Publicação já criada!', HttpStatus.FORBIDDEN);

    return await this.mediasRepository.removeMedia(id);
  }
}
