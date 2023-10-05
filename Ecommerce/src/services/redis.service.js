'use strict'
const redis=require('redis')
const { reservationInventory } = require('../models/repositories/inventory.repo')
const client=redis.createClient()

const acquireLock=async (productId,quantity,cartId)=>{
    const expireTime=3000
    const tryTimes=10
    const key=`2023${productId}`
    for(let i=0;i<tryTimes;i++){
        await client.connect()
        await client.set(key,expireTime,{NX:true})
        const result=await client.EXISTS(key)
        await client.disconnect()
        if(result==1){
            const checkReservation=await reservationInventory(productId,quantity,cartId)
            if(checkReservation.modifiedCount){
                await client.connect()
                await client.pExpire(key,expireTime)
                await client.disconnect()
                console.log(key)
                return key
            }
            return null
        }else{
            return new Promise((resolve)=>setTimeout(resolve,50))
        }
    }
}
const releaseLock=async (key)=>{
    await client.connect()
    await client.del(key)
    await client.disconnect()
}
module.exports={
    acquireLock,
    releaseLock
}