import { Router, Request, Response, NextFunction } from 'express';
import ShowHandler from '../handlers/showHandler';

class ShowController {
    public router = Router();

    constructor(){
        //Get show by id
        this.router.get('/:showId', this.showById );

        //Filter shows 
        this.router.post('/filtered', this.filteredShows );

        //Create new show
        this.router.post('/', this.newShow );

        //Update existing show
        this.router.put('/', this.editShow );
    }

    private showById(req: Request, res: Response){
        ShowHandler.getShowById(req,res);
    }

    private newShow(req: Request, res: Response){
        ShowHandler.createNewShow(req,res)
    }
    
    private filteredShows(req: Request, res: Response){
        ShowHandler.getFilteredShows(req,res);
    }

    private editShow(req: Request, res: Response){
        ShowHandler.updateShow(req,res);
    }

    // public async createNewShow(req: Request, res: Response, next: NextFunction){
    //     //Set the json array to object array if exit
    //     if(req.body.categories) req.body.categories = JSON.parse(req.body.categories);
    //     //Channel object
    //     let channel = '';
    //     if(req.body.channel){
    //         channel = req.body.channel;
    //         delete req.body.channel;
    //     } 
    //     const newShow = new Show(req.body);
    //     try {
    //         const show = await newShow.save();
    //         ChannelHandler.addShowToChannel(show, channel, res);
    //     } catch (error) {
    //         res.status(400).send({error: error});
    //     }
    // }
}

export default new ShowController