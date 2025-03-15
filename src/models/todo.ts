import mongoose from "mongoose";

//Todo Schema
const todoSchema= new mongoose.Schema({
    title :{type:String, required :true}, // Required
    completed:{type:Boolean, default :false}, //Default false
    createdAt :{type:Date ,default:Date.now} //Created Time
});

// Create Model
const Todo =mongoose.model("Todo",todoSchema);

//export 
export default Todo;