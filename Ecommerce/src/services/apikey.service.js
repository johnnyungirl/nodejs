const apiKeyModel=require('../models/apiKey.model')
const crypto=require('crypto')
const findbyID=async(key)=>{
    const newkey=await apiKeyModel.create({key:crypto.randomBytes(64).toString('hex'),permissions:['0000']})
    console.log(newkey)
    const objkey=await apiKeyModel.findOne({key,status:true}).lean()
    return objkey
}

module.exports={
    findbyID
}