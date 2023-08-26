import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Post()
  async createPublication(@Body() createPublicationDto: CreatePublicationDto) {
    return await this.publicationsService.createPublication(createPublicationDto);
  }

  @Get()
  async findAllPublications() {
    return await this.publicationsService.findAllPublications();
  }

  @Get(':id')
  async findPublicationById(@Param('id') id: string) {
    return await this.publicationsService.findPublicationById(+id);
  }

  @Patch(':id')
  async updatePublication(@Param('id') id: string, @Body() updatePublicationDto: UpdatePublicationDto) {
    return await this.publicationsService.updatePublication(+id, updatePublicationDto);
  }

  @Delete(':id')
  async removePublication(@Param('id') id: string) {
    return await this.publicationsService.removePublication(+id);
  }
}
