'use strict'

const { default: mongoose } = require("mongoose")
const DOCUMENT_NAME='Discount'
const COLLECTION_NAME='Discounts'
const discountSchema=new mongoose.Schema({
    discount_name:{type:String,required:true},
    discount_description:{type:String,default:"Khuyen mai"},
    discount_code:{type:String,required:true},
    discount_start_date:{type:Date,required:true,default:Date.now},
    discount_end_date:{type:Date,required:true},
    discount_type:{type:String,enum:['percentage','fixed amount']},
    discount_value:{type:Number,default:0},
    discount_max_uses_per_user:{type:Number,required:true},
    discount_min_value_order:{type:Number,required:true},
    discount_max_uses:{type:Number,required:true,default:1000},
    discount_count:{type:Number,default:0},
    discount_uses_used:{type:[String],default:[]},
    discount_applies_to:{type:String,enum:['specific','all'],default:'all'},
    discount_product_ids:{type:[String],default:[]},
    discount_shopId:{type:mongoose.Schema.Types.ObjectId,ref:'Shop'},
    discount_is_active:{type:Boolean,default:true},
    discount_max_values:{type:Number,default:0}
    
},{
    timestamps:true,
    collection:COLLECTION_NAME
})
module.exports=mongoose.model(DOCUMENT_NAME,discountSchema)