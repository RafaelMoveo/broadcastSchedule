import * as mongoose from 'mongoose';
// import { Document } from 'mongoose';
// import { IShow } from './showModel';

const Schema = mongoose.Schema;

// export interface IChannel extends Document {
//     name:   string;
//     number: number;
//     shows: [{ start_time: Date, show: IShow['_id'] }];
// }

const channelSchema = new Schema({
    name:   {type: String, unique: true, required:['The name of the channel is missing']},
    number: {type: Number}, required:['Channel number is missing'],
    shows:  [
                { 
                    start_time: Date,
                    show: {type: Schema.Types.ObjectId, ref: 'Show'}
                }
            ],
});

export default mongoose.model('Channel', channelSchema );
// export default mongoose.model<IChannel>('Channel', channelSchema );