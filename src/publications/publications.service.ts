import { Injectable } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationsRepository } from './publications.repository';

@Injectable()
export class PublicationsService {

  constructor(private readonly publicationsRepository: PublicationsRepository){}

  create(createPublicationDto: CreatePublicationDto) {
    return 'This action adds a new publication';
  }

  findAll() {
    return `This action returns all publications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} publication`;
  }

  update(id: number, updatePublicationDto: UpdatePublicationDto) {
    return `This action updates a #${id} publication`;
  }

  remove(id: number) {
    return `This action removes a #${id} publication`;
  }

  async findPublicationByMediaId(id: number){
    return this.publicationsRepository.findPublicationByMediaId(id)
  }

  async findPublicationByPostId(id: number){
    return this.publicationsRepository.findPublicationByPostId(id)
  }
}
