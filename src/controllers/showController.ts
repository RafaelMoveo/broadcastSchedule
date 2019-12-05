import { Request, Response } from 'express';
import { MongooseDocument } from 'mongoose';
import Show,{IShow} from '../models/showModel';
import ChannelController from '../controllers/channelController';

class ShowController {

    public getShowById(req: Request, res: Response){
        Show.findById( 
            req.params.showId,
            'name length description categories family_friendly age_limit',
            (error: Error, show: MongooseDocument) => {
                error? res.send(error) : res.json(show);
            });
    }

    public async createNewShow(req: Request, res: Response){
        res.send('hi');
        //Set the json array to object array if exit
        if(req.body.categories) req.body.categories = JSON.parse(req.body.categories);
        //Channel object
        let channel = '';
        if(req.body.channel){
            channel = req.body.channel;
            delete req.body.channel;
        } 
        const newShow = new Show(req.body);
        await newShow.save((error: Error, show: MongooseDocument) => {
            error? res.send(error) : '';

            channel? ChannelController.addShowToChannel(show, channel, res): res.send({ message: "Show added without a channel", show: show});
        });
    }
    
    public filteredShows(req: Request, res: Response){
        let matchConditions   = [];
        let aggregatePipeline = [];
        //Add age limit to the match conditions array  
        if(req.body.age_limit){
            const ageLimit = +req.body.age_limit;
            matchConditions.push({ 
                age_limit: { $gte: ageLimit }
            });
        }else{
            matchConditions.push({ 
                age_limit: { $gte: 0 }
            });
        }
        //Add family friendly to match conditions array 
        if(req.body.family_friendly){
            const ff = JSON.parse(req.body.family_friendly.toLowerCase());
            matchConditions.push({ 
                family_friendly: ff
            });
        }
        //Add name to match conditions array 
        if(req.body.name){
            matchConditions.push({ 
                name: req.body.name
            });
        }
        // Add all the match conditions to the aggregate pipeline
        aggregatePipeline.push({ $match: { $and: matchConditions }});
        // Add the skip option to the pipeline according to the offset
        // to enable pagination 
        const skip   = req.body.skip? +req.body.skip : 0;
        const offset = req.body.offset? +req.body.offset : 0;
        aggregatePipeline.push({ $skip: skip + offset });
        //Add limit to pipeline
        (req.body.limit)? aggregatePipeline.push({ $limit: skip + parseInt(req.body.limit) }) : '';
        Show
        .aggregate(aggregatePipeline)
        .exec((error: Error, shows:[IShow]) => {
            error? res.send(error): '';
            const response = {
                offset: shows.length + offset,
                shows: shows
            }
            res.send(response)
        });
    }

    public updateShow(req: Request, res: Response){
        const showId = req.body.id;
        const updateOptions = {
            new: true,
            select: 'name length description categories family_friendly age_limit',
            useFindAndModify: false,
        };
        //Set the json array to object array if exit
        if(req.body.categories) req.body.categories = JSON.parse(req.body.categories);
        Show.findByIdAndUpdate(showId, req.body, updateOptions, (error: Error, show:any) => {
            error? res.send(error):'';
            const message = show? 'Updated successfully': 'Show not found';
            res.send(message);
        });
    }
}
export default new ShowController