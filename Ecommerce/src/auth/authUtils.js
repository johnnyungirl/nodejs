'use strict'
const JWT=require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const { BadRequestError, AuthFailureError, NotFoundError } = require('../core/error.response')
const { findByUserId } = require('../services/keyToken.service')
const HEADER={
    API_KEY: 'x-api-key',
    CLIENT_ID:'x-client-id',
    AUTHORIZATION:'authorization',
    REFRESHTOKEN:'x-rtoken-id'
}
const createTokenPair = async (payload,publicKey,privateKey)=>{
    try{
        const accessToken= await JWT.sign(payload,privateKey,{
            algorithm:'RS256',
            expiresIn:'2 days'  
        })
        const refreshToken=await JWT.sign(payload,privateKey,{
                algorithm:'RS256',
                expiresIn:'6 days'
        })
        JWT.verify(accessToken,publicKey,(err,decode)=>{
            if (err){
                console.log(`error verify::`,err)
            }else{
                console.log(`decode verify::`,decode)
            }
            
        })
        return {accessToken,refreshToken}
    }catch(error){
    }
}

/*
    1. -Check userId missing ?
    2. -get accessToken
    3. -verifyToken
    4. -check user in dbs ?
    5. -check keystore with this userId?
    6. -OK all =>return next()
*/
const authentication=asyncHandler(async(req,res,next)=>{
    //1
    const userId=req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid Request')
    //2 
    const keyStore=await findByUserId(userId)
    if(!keyStore) throw new NotFoundError('Not found keystore')
    //3
    if(req.headers[HEADER.REFRESHTOKEN]){
        try{
            const refreshToken=req.headers[HEADER.REFRESHTOKEN]
            const decodeUser=JWT.verify(refreshToken,keyStore.privateKey)
            if(userId!==decodeUser.userId) throw new AuthFailureError("Invalid UserId")
            req.keyStore=keyStore
            req.user=decodeUser
            req.refreshToken=refreshToken
            return next()
        }catch(error){
            throw error
        }
    }

    const accessToken =req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid Request')
    try{
        const decodeUser=JWT.verify(accessToken,keyStore.publicKey)
        if(userId!==decodeUser.userId)throw new AuthFailureError('Invalid userId')
        req.keyStore=keyStore
        req.user=decodeUser
        return next()
    }catch (error){
        throw error
    }
})
const verifyJWT= async(refreshToken,privateKey)=>{
    return await JWT.verify(refreshToken,privateKey)
}
const getSelectData=(select=[])=>{
    return Object.fromEntries(select.map(el=>[el,1]))
}
const getUnSelectData=(select=[])=>{
    return Object.fromEntries(select.map(el=>[el,0]))
}
module.exports={
    createTokenPair,
    authentication,
    verifyJWT,
    getSelectData,
    getUnSelectData
}