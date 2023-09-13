'use strict'

const {model, Schema } = require("mongoose")

const DOCUMENT_NAME='Cart'
const COLLECTION_NAME='Carts'

const cartSchema=new Schema({
    cart_states:{
        type:String,
        required:true,
        default:"active",
        enum:["active","completed","pending","failed"]
    },
    cart_product:{
        type:Array,
        required:true,
        default:[],
    },
    cart_count_products:{
        type:Number,
        default:0
    },
    cart_userId:{
        type:Number,
        required:true
    }
},{
    collection:COLLECTION_NAME,
    timestamps:{
        createdAt:"createdOn",
        updatedAt:"modifiedOn"
    }
})
module.exports={
    cart:model(DOCUMENT_NAME,cartSchema)
}
