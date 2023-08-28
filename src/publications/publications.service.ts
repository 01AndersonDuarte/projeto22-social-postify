import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationsRepository } from './publications.repository';

@Injectable()
export class PublicationsService {
  constructor(
    private readonly publicationsRepository: PublicationsRepository,
  ) {}

  async checkMediaAndPostId(mediaId: number, postId: number) {
    const checkData = await this.publicationsRepository.findMediaAndPost(
      mediaId,
      postId,
    );
    if (!checkData.media || !checkData.post)
      throw new HttpException('Dados inválidos', HttpStatus.NOT_FOUND);
  }

  async createPublication(data: CreatePublicationDto) {
    await this.checkMediaAndPostId(data.mediaId, data.postId);
    return await this.publicationsRepository.createPublication(data);
  }

  async findAllPublications() {
    return await this.publicationsRepository.findAllPublications();
  }

  async findPublicationById(id: number) {
    const publication =
      await this.publicationsRepository.findPublicationById(id);
    if (!publication)
      throw new HttpException(
        'Publicação não encontrada',
        HttpStatus.NOT_FOUND,
      );

    return publication;
  }

  async updatePublication(id: number, data: UpdatePublicationDto) {
    const publication = await this.findPublicationById(id);
    await this.checkMediaAndPostId(data.mediaId, data.postId);
    if (new Date() > publication.date)
      throw new HttpException('Publicação já postada', HttpStatus.FORBIDDEN);

    return this.publicationsRepository.updatePublication(id, data);
  }

  async removePublication(id: number) {
    await this.findPublicationById(id);
    return await this.publicationsRepository.removePublication(id);
  }

  async findPublicationByMediaId(id: number) {
    return await this.publicationsRepository.findPublicationByMediaId(id);
  }

  async findPublicationByPostId(id: number) {
    return await this.publicationsRepository.findPublicationByPostId(id);
  }
}
