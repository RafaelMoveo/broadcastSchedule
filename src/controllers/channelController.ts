import { Request, Response } from 'express';
import { MongooseDocument } from 'mongoose';
import { Channel } from '../models/channelModel';

class ChannelController {

    getChannelShows(req: Request, res: Response){
        //Set the given time or get the current tume
        const time = req.body.time? new Date(req.body.time) : new Date();
        const num  = parseInt(req.body.channelNum);
        
        let aggregatePipeline = [];
        aggregatePipeline = [
            { $match: { number : num }},
            { $unwind: "$shows" },
            { $project: { shows: 1, _id: 0 }},
            { $match : { "shows.start_time": { "$gte": time }}},
            { $lookup : {
                    from: "shows",
                    localField: "shows.show",
                    foreignField: "_id",
                    as: "shows.showDetails"
                }
            },
            { $sort : { "shows.start_time": 1 }}
        ];

        // Add the skip option to the pipeline according to the offset
        // to enable pagination 
        const skip = req.body.skip? +req.body.skip : 0;
        const offset = req.body.offset? +req.body.offset : 0;
        aggregatePipeline.push({ $skip: skip + offset });

        //Add limit to pipeline
        (req.body.limit)? aggregatePipeline.push({ $limit: skip + parseInt(req.body.limit) }) : '';

        Channel.aggregate(aggregatePipeline)
        .exec((error: Error, channelShows: any) => {
            error? res.send(error): '';
            const response = {
                offset: channelShows.length + offset,
                channelShows: channelShows
            }
            res.send(response)
        });
    }
}
export default new ChannelController