import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    title : String,
    author : String,
    genre:String,
    desc :  String,
    imgId: String,
    reviewerId:String
});


export default mongoose.model("Review",reviewSchema);