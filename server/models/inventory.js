import mongoose, { model, Schema } from "mongoose";

const inventorySchema = new Schema({
    product_name:{
        type:String,
        required:true
    },
    product_price:{
        type:Number,
        required:true
    },
    product_description:String,
    stock:{
        type:Number,
        default:0
    },
    sales:{
        type:Number,
        default:0
    },
    unitSold:{
        type:Number,
        default:0
    },
    file:String,
    sku:String,
    addBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

},{timestamps:true})
 
const Inventory = model("Inventory",inventorySchema)
export default Inventory