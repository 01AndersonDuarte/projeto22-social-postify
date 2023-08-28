import { PrismaService } from '../../src/prisma/prisma.service';
import { createPost } from './post-factory';
import { createMedia } from './media-factory';

export async function createPublication(
  prisma: PrismaService,
  date: boolean = null,
) {
  const data = await createDataPublication(prisma, date);
  return prisma.publication.create({ data });
}

export async function createDataPublication(
  prisma: PrismaService,
  date: boolean = null,
) {
  const postFactory = await createPost(prisma);
  const mediaFactory = await createMedia(prisma);
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);

  return {
    mediaId: mediaFactory.id,
    postId: postFactory.id,
    date: date ? currentDate : new Date(),
  };
}
