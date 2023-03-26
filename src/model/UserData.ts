import { UserData } from '@prisma/client';
import assert from 'assert';
import { Request } from 'express';

export interface UserDataIn {
  dataType: string;
  data: string;
}

export interface UserDataOut {
  dataKey: string;
  dataType: string;
  data?: string;
  userId: string;
}

export const toUserDataIn = (req: Request): UserDataIn => {
  const body = req.body as UserDataIn;
  assert(body.dataType?.length);
  assert(body.data?.length);

  return body;
};

export const toUserDataOut = (record: UserData): UserDataOut => ({
  data: record.data?.toString(),
  dataKey: record.dataKey,
  dataType: record.dataType,
  userId: record.userId,
});
