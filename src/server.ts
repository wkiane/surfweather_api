import './util/module-alias'

import {Application} from 'express'

import {Server} from '@overnightjs/core';
import bodyParser from 'body-parser';

import {ForecastController} from './app/controllers/forecast'

export class SetupServer extends Server {
    constructor(private port = 3333) {
        super();
    }

    public int(): void {
        this.setupExpress();
        this.setupControllers();
    }

    private setupExpress(): void {
        this.app.use(bodyParser.json());
    }

    private setupControllers(): void {
        const forecastController = new ForecastController();

        this.addControllers([forecastController])
    }

    public getApp(): Application {
        return this.app;
    }
}