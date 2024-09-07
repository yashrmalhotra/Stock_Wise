import jwt from "jsonwebtoken"

const secretKey = "randomPassKey"
export const createToken = (user)=>{
    const payload = {
        _id:user._id,
        username:user.username,
    }
    return jwt.sign(payload,secretKey,{expiresIn:"24h"})
}

export const getUser = (token)=>{
    return jwt.verify(token,secretKey)
}