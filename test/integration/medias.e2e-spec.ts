import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { createMedia } from '.././factories/media-factory';
import { Media } from '@prisma/client';
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

describe('MediasController (e2e)', () => {
  it('POST /medias => Should respond with status 400 when body is invalid', async () => {
    await request(app.getHttpServer())
      .post('/medias')
      .send({
        title: 'Instagram',
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('POST /medias => Should respond with status 409 when item already exists', async () => {
    const mediaFactory: Media = await createMedia(prisma);
    const media = await request(app.getHttpServer())
      .post('/medias')
      .send({
        title: mediaFactory.title,
        username: mediaFactory.username,
      })
      .expect(HttpStatus.CONFLICT);

    expect(media.body.message).toBe('Item já criado');
  });

  it('POST /medias => Should respond with status 201 when body is valid', async () => {
    const media = await request(app.getHttpServer())
      .post('/medias')
      .send({
        title: 'Instagram',
        username: '@anderson',
      })
      .expect(HttpStatus.CREATED);

    expect(media.body).toEqual({
      id: expect.any(Number),
      title: 'Instagram',
      username: '@anderson',
    });
  });

  it('GET /medias => Should respond with status 200 and an empty list', async () => {
    const medias = await request(app.getHttpServer())
      .get('/medias')
      .expect(HttpStatus.OK);

    expect(medias.body).toEqual([]);
  });

  it('GET /medias => Should respond with status 200 and media list', async () => {
    const mediaFactory: Media = await createMedia(prisma);
    const medias = await request(app.getHttpServer())
      .get('/medias')
      .expect(HttpStatus.OK);

    expect(medias.body).toEqual([
      {
        id: mediaFactory.id,
        title: mediaFactory.title,
        username: mediaFactory.username,
      },
    ]);
  });

  it('GET /medias/:id => Should respond with status 400 when id is invalid', async () => {
    const mediaId = await request(app.getHttpServer())
      .get('/medias/1')
      .expect(HttpStatus.NOT_FOUND);

    expect(mediaId.body.message).toEqual('Registro não encontrado');
  });

  it('GET /medias/:id => Should respond with status 200 when id is valid', async () => {
    const mediaFactory: Media = await createMedia(prisma);
    const mediaId = await request(app.getHttpServer())
      .get(`/medias/${mediaFactory.id}`)
      .expect(HttpStatus.OK);

    expect(mediaId.body).toEqual({
      id: mediaFactory.id,
      title: mediaFactory.title,
      username: mediaFactory.username,
    });
  });

  it('UPDATE /medias/:id => Should respond with status 404 when id does not exist', async () => {
    const mediaUp = await request(app.getHttpServer())
      .patch('/medias/5')
      .send({
        title: 'Instagram',
        username: '@anderson',
      })
      .expect(HttpStatus.NOT_FOUND);

    expect(mediaUp.body.message).toEqual('Registro não encontrado');
  });

  it('UPDATE /medias/:id => Should respond with status 400 when body is invalid', async () => {
    const mediaFactory: Media = await createMedia(prisma);
    await request(app.getHttpServer())
      .patch(`/medias/${mediaFactory.id}`)
      .send({
        title: 'Instagram',
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('UPDATE /medias/:id => Should respond with status 200 when update happens', async () => {
    const mediaFactory: Media = await createMedia(prisma);
    const mediaUp = await request(app.getHttpServer())
      .patch(`/medias/${mediaFactory.id}`)
      .send({
        title: 'Instagram',
        username: '@anderson',
      })
      .expect(HttpStatus.OK);

    expect(mediaUp.body).toEqual({
      id: mediaFactory.id,
      title: 'Instagram',
      username: '@anderson',
    });
  });

  it('DELETE /medias/:id => Should respond with status 404 when id is not valid', async () => {
    const mediaDelete = await request(app.getHttpServer())
      .delete('/medias/1')
      .expect(HttpStatus.NOT_FOUND);

    expect(mediaDelete.body.message).toBe('Registro não encontrado');
  });

  it('DELETE /medias/:id => Should respond with status 403 when media cannot be deleted', async () => {
    const { mediaId } = await createPublication(prisma);

    const mediaDelete = await request(app.getHttpServer())
      .delete(`/medias/${mediaId}`)
      .expect(HttpStatus.FORBIDDEN);

    expect(mediaDelete.body.message).toBe('Publicação já criada!');
  });

  it('DELETE /medias/:id => Should respond with status 200 when media is deleted', async () => {
    const mediaFactory: Media = await createMedia(prisma);

    await request(app.getHttpServer())
      .delete(`/medias/${mediaFactory.id}`)
      .expect(HttpStatus.OK);
  });
});
