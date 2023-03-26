import expressApp from '../../src/init/express';
import { UserDataIn, UserDataOut } from '../../src/model/UserData';
import { buildAccessToken, clearDatabase, jwtUser } from './util';
import { beforeEach, describe, expect, it } from '@jest/globals';
import request from 'supertest';
import logger, { LoggingLevel } from '../../src/init/logger';

const testServer = request(expressApp);

// Test the controller-service-repository pipeline for UserData
describe('Pipeline for UserData', () => {
  const tDataKey = 'searchView';
  const tDataKeyNonex = 'nonexistentView';
  const tDataType1 = 'searchHistory';
  const tDataType2 = 'favoriteSearches';
  const tData1 = '{"searchTerm": "searchValue"}';
  const tData2 = '{"searchTerm": "anotherSearchValue"}';
  const tInDto1: UserDataIn = {
    dataType: tDataType1,
    data: tData1,
  };
  const tInDto2: UserDataIn = {
    dataType: tDataType2,
    data: tData2,
  };

  const doGet = (dataKey: string, expiredToken?: boolean) => {
    return testServer
      .get(`/api/v1/userData/${dataKey}`)
      .set('Authorization', `Bearer ${buildAccessToken(expiredToken)}`);
  };

  const doDelete = (dataKey: string, expiredToken?: boolean) => {
    return testServer
      .delete(`/api/v1/userData/${dataKey}`)
      .set('Authorization', `Bearer ${buildAccessToken(expiredToken)}`);
  };

  const doPost = (dataKey: string, dto: UserDataIn, expiredToken?: boolean) => {
    return testServer
      .post(`/api/v1/userData/${dataKey}`)
      .set('Authorization', `Bearer ${buildAccessToken(expiredToken)}`)
      .set('Content-Type', 'application/json')
      .send(dto);
  };

  const assertUserDataOut = (res: request.Response, dto: UserDataIn) => {
    const body: UserDataOut = res.body as UserDataOut;
    expect(body.dataKey).toBe(tDataKey);
    expect(body.dataType).toBe(dto.dataType);
    expect(body.data).toBe(dto.data);
    expect(body.userId).toBe(jwtUser.userId);
  };

  beforeEach(async () => {
    logger.setLevel(LoggingLevel.NONE);
    await clearDatabase();
  });

  it('rejects an empty token', async () => {
    const emptyToken = '';
    await testServer
      .get(`/api/v1/userData/${tDataKey}`)
      .set('Authorization', `Bearer ${emptyToken}`)
      .expect(401);
  });

  it('rejects an expired token', async () => {
    await doGet(tDataKey, true).expect(403);
  });

  it('gets nonexistent data', async () => {
    await doGet(tDataKeyNonex).expect(204);
  });

  it('fails to create insufficient data', async () => {
    const insufficientDto = { dataType: tDataType1 } as unknown as UserDataIn;
    await doPost(tDataKey, insufficientDto).expect(400);
  });

  it('fails to create wrongly typed or empty data', async () => {
    const tInDtoUndef: UserDataIn = {
      dataType: undefined as unknown as string,
      data: '',
    };
    await doPost(tDataKey, tInDtoUndef).expect(400);
  });

  it('fails to delete from empty key', async () => {
    await doDelete('').expect(404);
  });

  it('creates and gets data', async () => {
    await doPost(tDataKey, tInDto1).expect(201);
    await doGet(tDataKey)
      .expect(200)
      .expect((res) => assertUserDataOut(res, tInDto1));
  });

  it('creates and updates data', async () => {
    await doPost(tDataKey, tInDto1).expect(201);
    await doPost(tDataKey, tInDto2).expect(201);
    await doGet(tDataKey)
      .expect(200)
      .expect((res) => assertUserDataOut(res, tInDto2));
  });

  it('creates and deletes data', async () => {
    await doPost(tDataKey, tInDto1).expect(201);
    await doDelete(tDataKey).expect(200);
    await doGet(tDataKeyNonex).expect(204);
  });

  it('deletes nonexistent data', async () => {
    await doDelete(tDataKeyNonex).expect(200);
  });
});
