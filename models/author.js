import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const authorSchema = new Schema({
    name : String,
    age :  String
});


export default mongoose.model("Authors",authorSchema);