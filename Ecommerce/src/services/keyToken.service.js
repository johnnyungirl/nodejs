
'use strict'

const { Types } = require('mongoose')
const keyTokenModel=require('../models/keytoken.model')
const shopModel = require('../models/shop.model')

class KeytokenService{
    static createtoken=async ({userId,publicKey,privateKey,refreshToken})=>{
        try{
            // const publicKeyString=publicKey.toString()
            // const tokens= await keyTokenModel.create({
            //     user:userId,
            //     publicKey:publicKeyString
            // })
            // return tokens ? tokens.publicKey:null
            const filter={user:userId},update={publicKey,privateKey,refreshTokensUsed:[],refreshToken},options={upsert:true,new:true}
            const tokens=await keyTokenModel.findOneAndUpdate(filter,update,options)
            return tokens ? tokens.publicKey : null
            
        }catch(error){
            return error
        }
    }
    static findByUserId=async (userId)=>{
        return await keyTokenModel.findOne({user:new Types.ObjectId(userId)})
    }
    static removeKeyById=async(id)=>{
        return await keyTokenModel.findOneAndRemove(id)
    }
    static findByRefreshTokenUsed= async (refreshToken)=>{
        return await keyTokenModel.findOne({refreshTokensUsed:refreshToken}).lean()
    }
    static deleteKeyById=async (userId)=>{
        return await keyTokenModel.findByIdAndDelete({user:userId}).lean()
    }
    static findByRefreshToken=async (refreshToken)=>{
        return await keyTokenModel.findOne({refreshToken})
    }
}

module.exports= KeytokenService