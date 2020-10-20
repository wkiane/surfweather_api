import { SetupServer } from '@src/server';

import supertest from 'supertest';

let server: SetupServer;
beforeAll(async () => {
  server = new SetupServer();
  global.testRequest = supertest(server.getApp());
  await server.init();
});

afterAll(async () => await server.close());
