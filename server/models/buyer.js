import mongoose, { model, Schema } from "mongoose";

const buyerSchema = new Schema({
    buyer_name: {
        type: String
    },
    uid: String,
    address: String,
    state: String,
    pincode: {
        type: Number,
    },
    purchasedAmount: {
        type: Number,
        default: 0
    },
    addBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    purchasedQuantity: {
        type: Number,
        default: 0
    }

}, { timestamps: true})
buyerSchema.pre("save", function (next) {
    if(this.isNew){
    const buyer_name = this.buyer_name
    const id = this._id.toString()
    const key = buyer_name.slice(0, 2)+id.slice(5,8)
    this.uid = key
    next()
    }
})
const Buyer = model("Buyers", buyerSchema)
export default Buyer