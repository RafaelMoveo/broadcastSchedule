import { Request, Response } from 'express';
import Channel from '../models/channelModel';
import { MongooseDocument } from 'mongoose';

class ChannelHandler{

    public async getChannelShows(req: Request, res: Response){
        /** I hope there is a better way to get 
         * Israel timezone ISO  */
        //Set the given time or get the current time
        const globalTime  = new Date();
        const currentTime = globalTime.getTime() + (2*60*60*1000);
        const time        = req.body.time? new Date(req.body.time) : new Date(currentTime);
        const num         = parseInt(req.body.channelNum);

        let aggregatePipeline = [];
        aggregatePipeline = [
            { $match:   { number : num }},
            { $unwind:  "$shows" },
            { $project: { shows: 1, _id: 0 }},
            { $match :  { "shows.start_time": { "$gte": time }}},
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
        const skip   = req.body.skip? +req.body.skip : 0;
        const offset = req.body.offset? +req.body.offset : 0;
        aggregatePipeline.push({ $skip: skip + offset });
        //Add limit to pipeline
        (req.body.limit)? aggregatePipeline.push({ $limit: skip + parseInt(req.body.limit) }) : '';

        try{
            const channelShows = await Channel.aggregate(aggregatePipeline).exec();
            res.status(200).send({
                offset: channelShows.length + offset,
                channelShows: channelShows
            });
        } catch ( error ){
            res.status(500).send({error: error});
        }
    }


    public async addShowToChannel(newShow: MongooseDocument, channelNum: string, res: Response){
        const channelNumber = parseInt(channelNum);
        try{
            const channelShows = await Channel.aggregate([
                { $match:   { number : channelNumber }},
                { $unwind:  "$shows" },
                { $lookup : {
                        from: "shows",
                        localField: "shows.show",
                        foreignField: "_id",
                        as: "shows.showDetails"
                    }
                },
                { $sort : { "shows.start_time": 1 }}
            ]).exec();

            //Get last show aired
            let lastShow: any;
            let lastShowStartTime: Date;
            let lastShowDetails: any;
            let newShowStartTime: Date;
            //Check if there is shows in the channel
            if(channelShows.length){
                lastShow          = channelShows[channelShows.length - 1];
                lastShowStartTime = lastShow.shows.start_time;
                lastShowDetails   = lastShow.shows.showDetails[0];
                newShowStartTime  = new Date(lastShowStartTime.setMinutes(lastShowStartTime.getMinutes() + (lastShowDetails.length * 60)));
            }else{
                const globalTime = new Date();
                newShowStartTime = new Date(globalTime.getTime() + (2*60*60*1000));
            }
            // Set new show starting time by adding to the last show start time the show length in minutes 
            // Add the new show to the channel
            const newShowInChannel  = {
                start_time: newShowStartTime,
                show: newShow._id
            }

            await Channel.findOneAndUpdate(
                    { number : channelNumber },
                    { $push  : { shows: newShowInChannel }}
                );
            res.status(201).send(newShow);

        } catch(error){
            res.status(400).send({error: error});
        }
    }
}
export default new ChannelHandler