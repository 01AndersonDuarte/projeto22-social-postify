import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Publication } from '@prisma/client';
import { createPost } from '.././factories/post-factory';
import { createMedia } from '.././factories/media-factory';
import {
  createDataPublication,
  createPublication,
} from '.././factories/publication-factory';

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
describe('PublicationsController (e2e)', () => {
  it('POST /publications => Should respond with status 400 when body is invalid', async () => {
    await request(app.getHttpServer())
      .post('/publications')
      .send({
        mediaId: 1,
        postId: 1,
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('POST /publications => Should respond with status 400 when id media is invalid', async () => {
    const postFactory = await createPost(prisma);
    const publication = await request(app.getHttpServer())
      .post('/publications')
      .send({
        mediaId: 1,
        postId: postFactory.id,
        date: new Date(),
      })
      .expect(HttpStatus.NOT_FOUND);
    expect(publication.body.message).toEqual('Dados inválidos');
  });

  it('POST /publications => Should respond with status 400 when id post is invalid', async () => {
    const mediaFactory = await createMedia(prisma);
    const publication = await request(app.getHttpServer())
      .post('/publications')
      .send({
        mediaId: mediaFactory.id,
        postId: 1,
        date: new Date(),
      })
      .expect(HttpStatus.NOT_FOUND);
    expect(publication.body.message).toEqual('Dados inválidos');
  });

  it('POST /publications => Should respond with status 201 when publication is successfully created', async () => {
    const dataPublication = await createDataPublication(prisma);

    const publication = await request(app.getHttpServer())
      .post('/publications')
      .send(dataPublication)
      .expect(HttpStatus.CREATED);

    expect(publication.body).toEqual({
      id: expect.any(Number),
      mediaId: dataPublication.mediaId,
      postId: dataPublication.postId,
      date: dataPublication.date.toISOString(),
    });
  });

  it('GET /publications => Should respond with status 200 and an empty list', async () => {
    const publication = await request(app.getHttpServer())
      .get('/publications')
      .expect(HttpStatus.OK);

    expect(publication.body).toEqual([]);
  });

  it('GET /publications => Should respond with status 200 and a post list', async () => {
    const listPublications: Publication[] = [];
    for (let i = 0; i < 3; i++) {
      listPublications.push(await createPublication(prisma));
    }
    const publications = await request(app.getHttpServer())
      .get('/publications')
      .expect(HttpStatus.OK);

    expect(publications.body).toEqual([
      {
        id: expect.any(Number),
        mediaId: listPublications[0].mediaId,
        postId: listPublications[0].postId,
        date: listPublications[0].date.toISOString(),
      },
      {
        id: expect.any(Number),
        mediaId: listPublications[1].mediaId,
        postId: listPublications[1].postId,
        date: listPublications[1].date.toISOString(),
      },
      {
        id: expect.any(Number),
        mediaId: listPublications[2].mediaId,
        postId: listPublications[2].postId,
        date: listPublications[2].date.toISOString(),
      },
    ]);
  });

  it('GET /publications/:id => Should respond with status 404 when publication id is invalid', async () => {
    const post = await request(app.getHttpServer())
      .get('/publications/1')
      .expect(HttpStatus.NOT_FOUND);

    expect(post.body.message).toEqual('Publicação não encontrada');
  });

  it('GET /publications/:id => Should respond with status 200 when post is found', async () => {
    const publication = await createPublication(prisma);

    const response = await request(app.getHttpServer())
      .get(`/publications/${publication.id}`)
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({
      id: expect.any(Number),
      mediaId: publication.mediaId,
      postId: publication.postId,
      date: publication.date.toISOString(),
    });
  });

  it('UPDATE /publications/:id => Should respond with status 400 when body is invalid', async () => {
    const publicationFactory = await createPublication(prisma);
    const dataUpdate = await createDataPublication(prisma);
    await request(app.getHttpServer())
      .patch(`/publications/${publicationFactory.id}`)
      .send({
        mediaId: dataUpdate.mediaId,
        postId: dataUpdate.postId,
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('UPDATE /publications/:id => Should respond with status 404 when publication id is invalid', async () => {
    const dataUpdate = await createDataPublication(prisma);
    const publicationUp = await request(app.getHttpServer())
      .patch(`/publications/1`)
      .send(dataUpdate)
      .expect(HttpStatus.NOT_FOUND);

    expect(publicationUp.body.message).toBe('Publicação não encontrada');
  });

  it('UPDATE /publications/:id => Should respond with 404 status when media or post ID is invalid', async () => {
    const publicationFactory = await createPublication(prisma);
    const dataUpdate = await createDataPublication(prisma);

    const publicationUp = await request(app.getHttpServer())
      .patch(`/publications/${publicationFactory.id}`)
      .send({ ...dataUpdate, mediaId: -7 })
      .expect(HttpStatus.NOT_FOUND);

    expect(publicationUp.body.message).toBe('Dados inválidos');
  });

  it('UPDATE /publications/:id => Should respond with status 403 when post is active ', async () => {
    const publicationFactory = await createPublication(prisma);
    const dataUpdate = await createDataPublication(prisma);

    const publicationUp = await request(app.getHttpServer())
      .patch(`/publications/${publicationFactory.id}`)
      .send(dataUpdate)
      .expect(HttpStatus.FORBIDDEN);

    expect(publicationUp.body.message).toBe('Publicação já postada');
  });

  it('UPDATE /publications/:id => Should respond with status 200 when post is updated', async () => {
    const publicationFactory = await createPublication(prisma, true);
    const dataUpdate = await createDataPublication(prisma);

    const publicationUp = await request(app.getHttpServer())
      .patch(`/publications/${publicationFactory.id}`)
      .send(dataUpdate)
      .expect(HttpStatus.OK);

    expect(publicationUp.body).toEqual({
      id: expect.any(Number),
      mediaId: dataUpdate.mediaId,
      postId: dataUpdate.postId,
      date: dataUpdate.date.toISOString(),
    });
  });

  it('DELETE /publications/:id => Should respond with status 404 when id is not valid', async () => {
    const publicationDelete = await request(app.getHttpServer())
      .delete('/publications/1')
      .expect(HttpStatus.NOT_FOUND);

    expect(publicationDelete.body.message).toBe('Publicação não encontrada');
  });

  it('DELETE /publications/:id => Should respond with status 200 when publication is deleted', async () => {
    const publicationFactory = await createPublication(prisma);

    await request(app.getHttpServer())
      .delete(`/publications/${publicationFactory.id}`)
      .expect(HttpStatus.OK);
  });
});
