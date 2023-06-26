const compression = require("compression")
const express=require("express")
const helmet=require("helmet")
require('dotenv').config()
const morgan = require("morgan")
const app=express()
const { host, port, name } =require('./configs/configs.mongodb')
const connectionString = `mongodb://${host}:${port}/${name}`;
require('./dbs/init.mongodb')
//init middleware
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// const {checkOutload}=require('./helpers/check.connect')
// checkOutload()
// console.log(`Process::`,process.env)
// app.use(compression())
// app.use(morgan("dev"))
// app.use(morgan("combined"))
// app.use(morgan("common"))
// app.use(morgan("short"))
// app.use(morgan("tiny"))
//init db
require('./dbs/init.mongodb')
//init routes
app.use('/',require('./routes'))
//handle errors
app.use((req,res,next)=>{
    const error=new Error('Not Found')
    error.status=404
    next(error)
})
app.use((error,req,res,next)=>{
    const statusCode=error.status ||500
    return res.status(statusCode).json({
        status:'error',
        code:statusCode,
        stack:error.stack,
        message:error.message||'Internal Server Error'
    })
})

module.exports = app
