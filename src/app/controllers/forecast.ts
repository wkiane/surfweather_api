import { ClassMiddleware, Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Beach } from '@src/app/models/beach';
import { Forecast } from '@src/app/services/forecast';
import { authMiddleware } from '../middlewares/auth';
import logger from '@src/logger';
import { BaseController } from '.';

const forecast = new Forecast();

@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForecastController extends BaseController {
  @Get('')
  public async getForecastForgeLoggedUser (
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const beaches = await Beach.find({
        user: req.decoded?.id
      });
      const forecastData = await forecast.processForecastForBeaches(beaches);
      res.status(200).send(forecastData);
    } catch (error) {
      logger.error(error);
      this.sendErrorResponse(res, { code: 500, message: 'Something went wrong' });
    }
  }
}
