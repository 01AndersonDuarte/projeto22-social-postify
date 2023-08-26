import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MediasService } from './medias.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Controller('medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) { }

  @Post()
  async createMedia(@Body() createMediaDto: CreateMediaDto) {
    return await this.mediasService.createMedia(createMediaDto);
  }

  @Get()
  async findAllMedias() {
    return await this.mediasService.findAllMedias();
  }

  @Get(':id')
  async findMediaById(@Param('id') id: string) {
    return await this.mediasService.findMediaById(+id);
  }

  @Patch(':id')
  async updateMedia(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return await this.mediasService.updateMedia(+id, updateMediaDto);
  }

  @Delete(':id')
  removeMedia(@Param('id') id: string) {
    return this.mediasService.removeMedia(+id);
  }
}
