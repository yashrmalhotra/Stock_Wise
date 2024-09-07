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
export const checkAuthorize = (req,res,next)=>{
    if(req.user){
        res.json({authorize:true})
    }else{
        res.json({error:"please login to access page"})
    }
}