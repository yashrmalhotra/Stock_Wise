import { getUser } from "../services/authservice.js"

export const checkAuthenticate = (req,res,next)=>{
    const cookie = req.cookies.Token
    if(!cookie){
        next()
    }else{
        req.user = getUser(cookie)
        next()
    }
}
