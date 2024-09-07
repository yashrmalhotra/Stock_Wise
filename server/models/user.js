import mongoose,{model,Schema} from "mongoose";
import {createToken} from  "../services/authservice.js"

const userSchema = new Schema({
    name:{type:String,required:true},
    username:{type:String,required:true,unique:true},
    address:{type:String,required:true},
    state:{type:String,required:true},
    pincode:{type:Number,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    sales:{type:Number,default:0},
    unitSold:{type:Number,default:0},
},{timestamps:true})
userSchema.static("verifyAndGenerateToken",async function (username,password){
    const user = await this.findOne({username:username,password:password})
    
    if(!user){
        throw new Error("Username or Password is wrong")
    }else{
        const token = createToken(user)
        return token
    }

})
const User = model("User",userSchema)
export default User