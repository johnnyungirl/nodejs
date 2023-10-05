'use strict'
const {model, Schema, default: mongoose } = require("mongoose")

const DOCUMENT_NAME='Order'
const COLLECTION_NAME='Orders'

const orderSchema=new Schema({
    order_userId:{type:Number,required:true},
    order_checkout:{Type:Object,default:{}},
    /*
        order_checkout={
            totalPrice,
            totalApplyDiscount,
            feeShip
        }
    */
    order_shipping:{type:Object,default:{}},
    /*
        street,
        city,
        state,
        country
    */
   order_payment:{type:Object,default:{}}, 
   order_products:{type:Object,required:true},
   order_trackingNumber:{type:String,default:"#0000118052023"},
   order_status:{type:String,enum:['pending','comfirmed','shipped','cancelled','deliveried'],default:'pending'}

},{
    collection:COLLECTION_NAME,
    timestamps:{
        createdAt:"createdOn",
        updatedAt:"modifiedOn"
    }
})
module.exports=mongoose.model(DOCUMENT_NAME,orderSchema)