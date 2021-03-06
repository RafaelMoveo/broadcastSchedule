import { Request, Response } from 'express';
import Show from '../models/showModel';
import ChannelHandler from '../handlers/channelHandler';

class ShowHandler {

    public async getShowById(req: Request, res: Response){
        try{
            const show = await Show.findById(req.params.showId,'name length description categories family_friendly age_limit');
            res.status(200).json(show)
        } catch(error){
            res.status(500).send(error)
        }
    }

    public async createNewShow(req: Request, res: Response){
        //Set the json array to object array if exit
        if(req.body.categories) req.body.categories = JSON.parse(req.body.categories);
        //Channel object
        let channel = '';
        if(req.body.channel){
            channel = req.body.channel;
            delete req.body.channel;
        } 
        const newShow = new Show(req.body);
        try {
            const show = await newShow.save();
            ChannelHandler.addShowToChannel(show, channel, res);
        } catch (error) {
            res.status(400).send({error: error});
        }
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

    public async getFilteredShows(req: Request, res: Response){
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
        try{
            const shows = await Show.aggregate(aggregatePipeline).exec();
            res.status(200).send({
                offset: shows.length + offset,
                shows: shows
            })
        } catch(error){
            res.status(400).send(error);
        }
    }

}
export default new ShowHandler