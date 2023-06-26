const dev={
    app:{
        port:process.env.DEV_APP_PORT
    },
    db:{
        host:process.env.DEV_DB_HOST,
        port:process.env.DEV_DB_PORT,
        name:process.env.DEV_DB_NAME,
    },
}
const pro={
    app:{
        port:process.env.PRODUCT_APP_PORT
    },
    db:{
        host:process.env.PRODUCT_DB_HOST,
        port:process.env.PRODUCT_DB_PORT,
        name:process.env.PRODUCT_DB_NAME,
    }
}
const config={dev,pro}
const env=process.env.NODE_ENV ||'dev'
module.exports=config[env]