const { default: mongoose } = require("mongoose");
const __SECONDS=5000
const os=require('os')
const process=require('process')
const countConnect=()=>{
    const numberConnections=mongoose.connections.length
    console.log(`Number of Conncetions::${numberConnections}`)

}
const checkOutload=()=>{
    setInterval(()=>{
        const numberConnection=mongoose.connections.length
        const numsCore=os.cpus().length
        const memoryUsage=process.memoryUsage().rss
        const maxConnections=numsCore*5;
        console.log(`Active Connection::${numberConnection}`)
        console.log(`Memory Usage:: ${memoryUsage/1024/1024} MB`)
        if(numberConnection>maxConnections){
            console.log('Connection overload detected')
        }
    },__SECONDS)
}
module.exports = {countConnect,checkOutload}