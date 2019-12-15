import * as express from 'express';
import * as bodyParser from 'body-parser';
import './config/dbConfig';
import ShowController from './controllers/showController';
import ChannelController from './controllers/channelController';

class App {
    public instance : express.Application;
    
    constructor() {
        this.instance = express();
        this.appInit();
    }

    private appInit() {
        this.parsTheRequests();
        this.instance.use('/show', ShowController.router);
        this.instance.use('/channel', ChannelController.router);
    }
    
    private parsTheRequests(){
        this.instance.use(bodyParser.json());
        this.instance.use(bodyParser.urlencoded({ extended: true }));	
    }
}

export const app = new App().instance;