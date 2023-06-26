const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const DOCUMENT_NAME="Inventory"
const COLLECTION_NAME="Inventories"
const inventorySchema=new mongoose.Schema({
    inven_productId:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},
    inven_location:{type:String,default:'unknown'},
    inven_stock:{type:Number,required:true},
    inven_shopId:{type:mongoose.Schema.Types.ObjectId,ref:'Shop'},
    inven_reservations:{type:Array,default:{}}
    /**
     * cardId:,
     * stock:1,
     * createOn:
     */
},{
    timestamps:true,
    collection:COLLECTION_NAME
})
//Export the model
module.exports = mongoose.model(DOCUMENT_NAME,inventorySchema);