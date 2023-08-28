import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { PublicationsService } from '../publications/publications.service';

@Injectable()
export class PostsService {
  constructor(
    @Inject(forwardRef(() => PublicationsService))
    private readonly publicationsService: PublicationsService,
    private readonly postsRepository: PostsRepository,
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    return this.postsRepository.create(createPostDto);
  }

  async findAllPosts() {
    return await this.postsRepository.findAll();
  }

  async findPostById(id: number) {
    const post = await this.postsRepository.findPostById(id);
    if (!post) throw new HttpException('Post inválido', HttpStatus.NOT_FOUND);

    return post;
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto) {
    await this.findPostById(id);
    return await this.postsRepository.update(id, updatePostDto);
  }

  async removePost(id: number) {
    const post = await this.findPostById(id);
    const publication = await this.publicationsService.findPublicationByPostId(
      post.id,
    );
    if (publication)
      throw new HttpException('Publicação já criada!', HttpStatus.FORBIDDEN);

    return this.postsRepository.remove(id);
  }
}
