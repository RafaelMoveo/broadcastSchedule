import * as mongoose from 'mongoose';

//mongoose connection
const mongoDB = 'mongodb://127.0.0.1/broadcastdb';
mongoose.connect(mongoDB, { 
    useUnifiedTopology :true,
    useNewUrlParser    :true,
    useCreateIndex     :true,
    useFindAndModify   :false,
});

//Get connection
const db = mongoose.connection;

//Get error notification on connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
.once('open', () => {
    console.log('DB connection success!');
});