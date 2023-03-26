import prisma from '../../src/init/prisma';
import { sign, SignOptions } from 'jsonwebtoken';

export const jwtUser = { name: 'Average Programmer', userId: 'apr' };

export const clearDatabase = async () => {
  await prisma.$transaction([prisma.userData.deleteMany()]);
  await prisma.$disconnect();
};

export const buildAccessToken = (expiredToken?: boolean): string => {
  const privateToken: string = process.env.PRIVATE_TOKEN as string;
  const options: SignOptions = {
    algorithm: 'HS256',
    expiresIn: expiredToken ? 0 : 60,
  };

  return sign(jwtUser, privateToken, options);
};
