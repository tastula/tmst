import * as UserDataRepository from '../repository/UserDataRepository';
import { UserData } from '@prisma/client';
import { toUserDataOut, UserDataOut } from '../model/UserData';

export const getUserData = async (
  dataKey: string,
  userId: string
): Promise<UserDataOut | undefined> => {
  return UserDataRepository.getUserData(dataKey, userId).then(
    (record: UserData | null) => {
      return record === null ? undefined : toUserDataOut(record);
    }
  );
};

export const upsertUserData = (
  dataKey: string,
  dataType: string,
  data: string,
  userId: string
) => {
  return UserDataRepository.upsertUserData(dataKey, dataType, data, userId);
};

export const deleteUserData = (dataKey: string, userId: string) => {
  return UserDataRepository.deleteUserData(dataKey, userId);
};
