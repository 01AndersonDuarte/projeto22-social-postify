import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';

export async function createPost(prisma: PrismaService) {
  const data = createDataPost();
  return prisma.post.create({ data });
}

export function createDataPost() {
  return {
    title: faker.lorem.words(),
    text: faker.lorem.sentence(),
    image: faker.image.url(),
  };
}
