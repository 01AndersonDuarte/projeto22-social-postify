import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Post } from '@prisma/client';
import { createDataPost, createPost } from '.././factories/post-factory';
import { createPublication } from '.././factories/publication-factory';

let app: INestApplication;
let prisma: PrismaService;

beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule, PrismaModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  prisma = app.get(PrismaService);

  await prisma.publication.deleteMany();
  await prisma.media.deleteMany();
  await prisma.post.deleteMany();

  await app.init();
});

describe('PostsController (e2e)', () => {
  it('POST /posts => Should respond with status 400 when body is invalid', async () => {
    await request(app.getHttpServer())
      .post('/posts')
      .send({
        title: 'Um título qualquer',
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('POST /posts => Should respond with status 201 when item is successfully created', async () => {
    const postData = createDataPost();
    const post = await request(app.getHttpServer())
      .post('/posts')
      .send(postData)
      .expect(HttpStatus.CREATED);

    expect(post.body).toEqual({
      id: expect.any(Number),
      title: postData.title,
      text: postData.text,
      image: postData.image,
    });
  });

  it('GET /posts => Should respond with status 200 and an empty list', async () => {
    const post = await request(app.getHttpServer())
      .get('/posts')
      .expect(HttpStatus.OK);

    expect(post.body).toEqual([]);
  });

  it('GET /posts => Should respond with status 200 and a post list', async () => {
    const listPosts: Post[] = [];
    for (let i = 0; i < 3; i++) {
      listPosts.push(await createPost(prisma));
    }
    const post = await request(app.getHttpServer())
      .get('/posts')
      .expect(HttpStatus.OK);

    expect(post.body).toEqual([
      {
        id: expect.any(Number),
        title: listPosts[0].title,
        text: listPosts[0].text,
        image: listPosts[0].image,
      },
      {
        id: expect.any(Number),
        title: listPosts[1].title,
        text: listPosts[1].text,
        image: listPosts[1].image,
      },
      {
        id: expect.any(Number),
        title: listPosts[2].title,
        text: listPosts[2].text,
        image: listPosts[2].image,
      },
    ]);
  });

  it('GET /posts/:id => Should respond with status 404 when post id is invalid', async () => {
    const post = await request(app.getHttpServer())
      .get('/posts/1')
      .expect(HttpStatus.NOT_FOUND);

    expect(post.body.message).toEqual('Post inválido');
  });

  it('GET /posts/:id => Should respond with status 200 when post is found', async () => {
    const postFactory: Post = await createPost(prisma);
    const post = await request(app.getHttpServer())
      .get(`/posts/${postFactory.id}`)
      .expect(HttpStatus.OK);

    expect(post.body).toEqual({
      id: expect.any(Number),
      title: postFactory.title,
      text: postFactory.text,
      image: postFactory.image,
    });
  });

  it('UPDATE /posts/:id => Should respond with status 400 when body is invalid', async () => {
    const postFactory: Post = await createPost(prisma);
    const postUpdate = createDataPost();
    await request(app.getHttpServer())
      .patch(`/posts/${postFactory.id}`)
      .send({
        title: postUpdate.title,
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('UPDATE /posts/:id => Should respond with status 404 when post id is invalid', async () => {
    const postUpdate = createDataPost();

    const postUp = await request(app.getHttpServer())
      .patch(`/posts/1`)
      .send({
        title: postUpdate.title,
        text: postUpdate.text,
        image: postUpdate.image,
      })
      .expect(HttpStatus.NOT_FOUND);

    expect(postUp.body.message).toBe('Post inválido');
  });

  it('UPDATE /posts/:id => Should reply with status 200 when post is updated', async () => {
    const postFactory: Post = await createPost(prisma);
    const postUpdate = createDataPost();

    const postUp = await request(app.getHttpServer())
      .patch(`/posts/${postFactory.id}`)
      .send({
        title: postUpdate.title,
        text: postUpdate.text,
        image: postUpdate.image,
      })
      .expect(HttpStatus.OK);

    expect(postUp.body).toEqual({
      id: expect.any(Number),
      title: postUpdate.title,
      text: postUpdate.text,
      image: postUpdate.image,
    });
  });

  it('DELETE /posts/:id => Should respond with status 404 when id is not valid', async () => {
    const postDelete = await request(app.getHttpServer())
      .delete('/posts/1')
      .expect(HttpStatus.NOT_FOUND);

    expect(postDelete.body.message).toBe('Post inválido');
  });

  it('DELETE /posts/:id => Should respond with status 403 when post cannot be deleted', async () => {
    const { postId } = await createPublication(prisma);

    const postDelete = await request(app.getHttpServer())
      .delete(`/posts/${postId}`)
      .expect(HttpStatus.FORBIDDEN);

    expect(postDelete.body.message).toBe('Publicação já criada!');
  });

  it('DELETE /posts/:id => Should respond with status 200 when post is deleted', async () => {
    const postFactory: Post = await createPost(prisma);

    await request(app.getHttpServer())
      .delete(`/posts/${postFactory.id}`)
      .expect(HttpStatus.OK);
  });
});
