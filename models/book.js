import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const bookSchema = new Schema({
    name : String,
    genre :  String,
    writerId : String
});


export default mongoose.model("Books",bookSchema);