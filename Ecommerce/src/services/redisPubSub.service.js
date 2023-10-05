// const redis=require('redis')


// class PubSubService{
//     constructor(){
//         this.publisher=redis.createClient()
//         this.subscriber=redis.createClient()
//     }
//     publish (channel,message){
//         return new Promise((resolve,reject)=>{
//             this.publisher.connect()
//             this.publisher.publish(channel,message,(err,result)=>{
//                 if(err){
//                     reject(err)
//                 }
//                 resolve(result)
//             })
//         })
//     }
//     subscribe(channel){
//         this.subscriber.connect()
//         this.subscriber.subscribe(channel)
//         this.subscriber.on('message',(subscriberChannel,message)=>{
//             if(channel==subscriberChannel){
//                 callback(channel,message)
//             }
//         })
        
//     }
// }
// module.exports=new PubSubService()