import * as express from 'express';
import * as bodyParser from 'body-parser';
import { showsRoutes } from './routes/showRoutes';
import { channelRoutes } from './routes/channelRoutes';
import './config/dbConfig';

class App {
    public instance : express.Application;
    
    constructor() {
        this.instance = express();
        this.appInit();
    }

    private appInit() {
        this.parsTheRequests();
        this.instance.use('/show', showsRoutes);
        this.instance.use('/channel', channelRoutes);
    }
    
    private parsTheRequests(){
        this.instance.use(bodyParser.json());
        this.instance.use(bodyParser.urlencoded({ extended: true }));	
    }
}

export const app = new App().instance;
