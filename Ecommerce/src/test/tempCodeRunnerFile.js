const redis=require('redis')
const client=redis.createClient()
const acquireLock=async ()=>{
    const expireTime=300
    const tryTimes=10
    const key=`2023${123}`
    await client.connect()
    for(let i=0;i<tryTimes;i++){
        const result=await client.set(key,expireTime,{NX:true})
        console.log(result)
        if(result==1){
            console.log('purchased')
            await client.pExpire(key,expireTime)
            return key
        }else{
            return new Promise((resolve)=>setTimeout(resolve,50))
        }
    }
    await client.disconnect()
}
acquireLock()