import { Router, Request, Response } from 'express';
import ChannelHandler from '../handlers/channelHandler';

class ChannelController { 

    public router = Router();

    constructor(){
        this.router.post('/', this.channelShows);
    }

    private channelShows(req: Request, res: Response){
        ChannelHandler.getChannelShows(req,res);
    }
}
export default new ChannelController