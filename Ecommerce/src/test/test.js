const { result } = require("lodash")
const mongoose=require("mongoose")
mongoose.connect('mongodb://localhost/testQueries').then(()=>{
    console.log(`connect success`)
})
const Character =  mongoose.model('Character',new mongoose.Schema({
    id:Number,
    shop_order_ids:[{
        shopId:Number,
        item_products:[{
            quantity:Number,
            price:Number,
            shopId:Number,
            old_quantity:Number,
            productId:Number

        }],
        version:Number
    }]
}))
/*
        shop_order_ids:[
            {
                shopId,
                item_products:[
                    {
                        quantity,
                        price,
                        shopId,
                        old_quantity,
                        productId
                    }
                ],
                version
            }
        ]
*/
async function AddItemToCharacter(){
    const query={id:1}
    const update={
        $addToSet:{
            shop_order_ids:[
                {
                    shopId:1,
                    item_products:[
                        {
                            quantity:5,
                            price:150,
                            shopId:2,
                            old_quantity:4,
                            productId:13
                        }
                    ],
                    version:2000
                }
            ]
        }
    }
    const options={upsert:true,new:true}  
    try{
        const result=await Character.findOneAndUpdate(query,update,options)
        console.log(result)
    } catch(error){
        console.error(error)
    } finally{
        mongoose.disconnect()
    }
}
async function FindItemCharacter(){
    const query={id:1}
    try{
        const result=await Character.findOne(query)
        console.log(result.shop_order_ids[0].item_products[0].productId)
    }catch(error){
        console.error(error)
    }finally{
        mongoose.disconnect()
    }
}
FindItemCharacter()
async function main(){
   try{
    await Character.create({product:"Truong Minh Tien"})
    const query=await Character.findOneAndUpdate({product:"Truong Minh Tien"},{age:20},{upsert:true,new:true})
    console.log('before',query)
    const result=await Character.find({product:'Truong Minh Tien'})
    console.log('after',result)
   } catch(error){
        console.error(error)
   } finally{
        mongoose.disconnect()
   }
}
async function createCart(){
    const query={
        id:1,
    }
    const update={
        $addToSet:{
            product:{
                productId:14,
                quantity:1,
                stock:2
            }
        }
    }
    const options={upsert:true,new:true}
    try{
        const foundCart =await Character.findOneAndUpdate(query,update,options)
        console.log(foundCart) 
    
    }catch(error){
        console.error(error)

    }finally{
        mongoose.disconnect()
    }
}
async function IncreaseCartItemQuantity(){
    const query ={
        id:1,
        'product.productId':21,

    }
    const update={
        $inc:{
            'product.$.quantity':1,
            'product.$.stock':-1
        }
    }
    const options={
        upsert:true,new:true
    }
    try{
        const result= await Character.findOneAndUpdate(query,update,options)
        console.log(result)
    } catch(error){
        console.error(error)
    } finally {
        mongoose.disconnect()
    }
}
async function AddToCart(){
    const query={
        id:1,
    }
    const update={
        $addToSet:{
            product:{
                productId:20,
                quantity:5,
                stock:10
            }
        }
    }
    const options={upsert:true,new:true}
    try{
        const result=await Character.findOneAndUpdate(query,update,options)
        console.log(result)
    } catch(error){
        console.error(error)
    } finally{
        mongoose.disconnect()
    }
}
async function DeleteItemfromCart(){
    const productId=13
    const query={id:1}
    const update={
        $pull:{
            product:{
                productId
            }
        }
    }
    const options={upsert:true,new:true}
    try{
        const result=await Character.updateOne(query,update,options)
        console.log(result)
    }catch(error){
        console.error(error)
    }finally{
        mongoose.disconnect()
    }
}