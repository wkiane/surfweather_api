import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Beach } from '../models/beach';
import { Forecast } from '../services/forecast';

const forecast = new Forecast();
@Controller('forecast')
export class ForecastController {
  @Get('')
  public async getForecastForLoggedUser (_: Request, res: Response): Promise<void> {
    try {
      const beaches = await Beach.find({});
      const forecastData = await forecast.processForecastForBeaches(beaches);
      res.status(200).send(forecastData);
    } catch {
      res.status(500).send({ error: 'Something went wrong' });
    }
  }
}
