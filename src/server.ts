import './util/module-alias';
import { config } from 'dotenv';
import { Application } from 'express';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import * as database from '@src/database';
import expressPino from 'express-pino-logger';
import cors from 'cors';
import { ForecastController } from './app/controllers/forecast';
import { BeachesController } from './app/controllers/beaches';
import { UsersController } from './app/controllers/users';
import logger from './logger';

export class SetupServer extends Server {
  constructor (private port = 3333) {
    super();
    config();
  }

  public async init (): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.setupDatabase();
  }

  private setupExpress (): void {
    this.app.use(bodyParser.json());
    this.app.use(expressPino({
      logger
    }));
    this.app.use(cors({
      origin: '*'
    }));
  }

  private setupControllers (): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    const usersController = new UsersController();

    this.addControllers([forecastController, beachesController, usersController]);
  }

  private async setupDatabase (): Promise<void> {
    await database.connect();
  }

  public start (): void {
    this.app.listen(this.port, () => {
      logger.info(`Server is listening on port: ${this.port}`);
    });
  }

  public async close (): Promise<void> {
    await database.close();
  }

  public getApp (): Application {
    return this.app;
  }
}
