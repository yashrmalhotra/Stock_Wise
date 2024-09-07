import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./routes/route.js"; // Ensure the path is correct
import multer from "multer"
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import productRoute from "./routes/productRoute.js"
import buyerRoute from "./routes/buyerRoute.js"
import path from "path"
import {fileURLToPath} from "url"
import { checkAuthenticate } from "./middlewares/middleware.js";
import "dotenv/config.js"

const port = process.env.PORT || 3000
mongoose.connect(process.env.MONGODB_URL).then(() => { console.log("connected") })
const app = express();
app.use(cookieParser())
app.use(checkAuthenticate)
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL, // Your frontend URL
  credentials: true // Allow cookies to be sent with requests
}));



const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
app.use(express.static(path.join(dirname,"dist")))
app.use(express.static(path.join(dirname,'public')));

app.get("/auth",(req,res)=>{
  console.log(req.user)
  const reqpath = req.path
  console.log(reqpath,"req path")
  if(!req.user){
    res.json({error:"please Login"})
  }else{
    res.json({loggedIn:true})
  }
})


app.use("/user", router); // Use the router
app.use("/product",productRoute)
app.use("/buyer",buyerRoute)


app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
