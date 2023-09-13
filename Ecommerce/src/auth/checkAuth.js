'use strict'

const { findbyID } = require("../services/apikey.service")

const HEADER={
    API_KEY: 'x-api-key',
    AUTHORIZATION:'authorization'
}
const apiKey=async(req,res,next)=>{
    try{
        const key= req.headers[HEADER.API_KEY]?.toString()
        if(!key){
            return res.status(403).json({
                message:'Forbiden Error'
            })``
        }
        //check objkey
        const objKey=await findbyID(key)
        if(!objKey){
            return res.status(403).json({
                message:'Forbiden Error'
            })
        }
        req.objKey=objKey
        return next()
       
    }catch(error){
    }
    
}
//check permission
const permisson=(permission)=>{
    return (req,res,next)=>{
        if(!req.objKey.permissions){
            return res.status(403).json({
                message:'Permission denied'
            })
        }
        console.log(`permissions::`,req.objKey.permissions)
        const validPermissions=req.objKey.permissions.includes(permission)
        if(!validPermissions){
            return res.status(403).json({
                message:'Permission denied'
            })
        }
        return next()
    }
}
const asyncHandler=fn=>{
    return(req,res,next)=>{
        fn(req,res,next).catch(next)
    }
}
module.exports={
    apiKey,
    permisson,
    asyncHandler
}