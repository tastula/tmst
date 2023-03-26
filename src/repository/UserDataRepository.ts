import { UserData } from '@prisma/client';
import prisma from '../init/prisma';

export const getUserData = async (
  dataKey: string,
  userId: string
): Promise<UserData | null> => {
  return await prisma.userData.findFirst({
    where: {
      dataKey: dataKey,
      userId: userId,
    },
  });
};

export const upsertUserData = async (
  dataKey: string,
  dataType: string,
  data: string,
  userId: string
) => {
  await prisma.userData.upsert({
    where: {
      dataKey_userId: {
        dataKey: dataKey,
        userId: userId,
      },
    },
    update: {
      data: data,
      dataType: dataType,
    },
    create: {
      data: data,
      dataKey: dataKey,
      dataType: dataType,
      userId: userId,
    },
  });
};

export const deleteUserData = async (dataKey: string, userId: string) => {
  // Normal delete fails due to missing "if not exists" logic, use deleteMany
  await prisma.userData.deleteMany({
    where: {
      dataKey: dataKey,
      userId: userId,
    },
  });
};
