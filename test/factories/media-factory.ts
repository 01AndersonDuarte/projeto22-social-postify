import { faker } from "@faker-js/faker";
import { PrismaService } from "../../src/prisma/prisma.service";

export async function createMedia(prisma: PrismaService) {
  const socialMediaNames = [
    'Twitter',
    'Instagram',
    'Facebook',
    'LinkedIn',
    'TikTok',
    'Snapchat',
    'Pinterest'
  ];
  
  const randomSocialMedia = socialMediaNames[Math.floor(Math.random() * 7)];
  return prisma.media.create({
    data: {
      title: randomSocialMedia,
      username: faker.internet.userName()
    },
  });
}