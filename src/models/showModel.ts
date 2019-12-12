import * as mongoose from 'mongoose';

// export interface IShow extends Document {
//     name: string;
//     length: number;
//     description: string;
//     categories: [string];
//     family_friendly: boolean;
//     age_limit: number;
// }

const showSchema = new mongoose.Schema({
    name:             {type: String, required:['The name of the show is missing']},
    length:           {type: Number, min:0.3, max:3}, required:['How long is that show in hours?'],
    description:      String,
    categories:       [String],
    family_friendly : {type: Boolean, required:['Does it family friendly?']},
    age_limit:        {type: Number, required:['What is the age limit of that show?']}
});

//Creating show modal
export default mongoose.model('Show', showSchema );
// export default mongoose.model<IShow>('Show', showSchema );