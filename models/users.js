import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    name : String,
    email : String,
    password:String,
});


export default mongoose.model("Users",usersSchema);