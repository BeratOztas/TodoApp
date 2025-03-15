import mongoose from "mongoose";

//Todo Schema
const todoSchema= new mongoose.Schema({
    title :{type:String, required :true}, // Zorunlu
    completed:{type:Boolean, default :false}, //todo Default olarak false
    createdAt :{type:Date ,default:Date.now} //Oluşturulma tarihi
});


// Modeli oluştur
const Todo =mongoose.model("Todo",todoSchema);

//export et
export default Todo;