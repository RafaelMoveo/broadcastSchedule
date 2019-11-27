import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

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

export const Channel = mongoose.model('Channel', channelSchema );