'use strict'
const mongoose = require('mongoose'); // Erase if already required
const DOCUMENT_NAME="Product"
const COLLECTION_NAME="Products"
const slugify=require('slugify')
// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema({
    product_description:String,
    product_slug:String,
    product_name:{type:String, required:true},
    product_thumb:{type:String, required:true},
    product_price:{type:Number, required:true},
    product_quantity:{type:Number, required:true},
    product_variations:{type:Array,default:[]},
    isDraft:{type:Boolean,default:true,index:true,select:false},
    product_shop:{type:mongoose.Schema.Types.ObjectId,ref:'Shop'},
    isPublished:{type:Boolean,default:false,index:true,select:false},
    product_attributes:{type:mongoose.Schema.Types.Mixed,required:true},
    product_type:{type:String, required:true,enum:['Electronics','Clothing','Furniture']},
    product_ratingsAverage:{
        type:Number,
        default:4.5,
        min: [1,'Rating must be above 1.0'],
        max: [5,'Rating must be below 5.0'],
        set:(val)=>Math.round(val*10)/10
    },
},{
    collection:COLLECTION_NAME,
    timestamps:true
});
//Create index for search
productSchema.index({product_name:'text',product_description:'text'})
//Document middleware:runs before .save() and .create()...
productSchema.pre('save',function(next){
    this.product_slug=slugify(this.product_name,{lower:true})
    next()
})
const clothingSchema=new mongoose.Schema({
    brand:{type:String,required:true},
    size:String,
    material:String,
    product_shop:{type:mongoose.Schema.Types.ObjectId,ref:'Shop'},
},{
    collection:`clothes`,
    timestamps:true
})
const electronicSchema=new mongoose.Schema({
    manufacturer:{type:String,required:true},
    model:String,
    color:String,
    product_shop:{type:mongoose.Schema.Types.ObjectId,ref:'Shop'},
},{
    collection:'electronics',
    timestamps:true
})
const furnitureSchema=new mongoose.Schema({
    "brand":{type:String,required:true},
    "size":String,
    "material":String,
    product_shop:{type:mongoose.Schema.Types.ObjectId,ref:'Shop'}
},{
    collection:"furnitures",
    timestamps:true
})
//Export the model
module.exports = {
    product:mongoose.model(DOCUMENT_NAME,productSchema),
    electronic:mongoose.model('Electronics',electronicSchema),
    clothing:mongoose.model('Clothing',clothingSchema),
    furniture:mongoose.model('Furnitures',furnitureSchema)
}