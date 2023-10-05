'use strict'

const { NotFoundError, BadRequestError } = require("../core/error.response")
const discountModel = require("../models/discount.model")
const { findAllDiscountCodeUnselect, checkDiscountExists } = require("../models/repositories/discount.repo")
const { convertToObjectIdMongodb } = require("../utils/index")
const { findAllProducts } = require("./product.service")
class DiscountService{
    static async CreateDiscount(
        {
            name,description,code,
            start_date,end_date,
            type,value,max_uses_per_user,
            min_order_value,max_uses,
            applies_to,product_ids,
            count,max_value,shopId,
            is_active,uses_used
        }=payload
    ){
        const foundDiscount=await discountModel.findOne({
            discount_shopId:convertToObjectIdMongodb(shopId),
            discount_code:code
        })
        if(foundDiscount && foundDiscount.discount_is_active){
            throw new BadRequestError("Discount already exists")
        }
        if(foundDiscount && !foundDiscount.discount_is_active){
            throw new BadRequestError("Discount already exists but not active")
        }
        if(Date(start_date)<new Date() ||Date(end_date)<new Date()){
            throw new BadRequestError("Invalid Date Time")
        }
        const newDiscount=await discountModel.create({
            discount_name:name,
            discount_description:description,
            discount_code:code,
            discount_start_date:new Date(start_date),
            discount_end_date:new Date(end_date),
            discount_type:type,
            discount_value:value,
            discount_max_uses_per_user:max_uses_per_user,
            discount_min_value_order:min_order_value||0 ,
            discount_max_uses:max_uses,
            discount_count:count,
            discount_uses_used:uses_used,
            discount_applies_to:applies_to,
            discount_product_ids:product_ids,
            discount_shopId:shopId,
            discount_is_active:is_active,
            discount_max_values:max_value
        })
        return newDiscount
    }
    // static async GetProductsByDiscountCode({shopId,code,skip=0,page=1,limit=50}){
    //     const foundDiscount=await discountModel.findOne({
    //         discount_shopId:convertToObjectIdMongodb(shopId),
    //         discount_code:code
    //     })
    //     if(!foundDiscount ||!foundDiscount.discount_is_active){
    //         throw new BadRequestError("Invalid discount code")
    //     }
    //     const {discount_end_date,discount_start_date,discount_code}=foundDiscount
    //     if(new Date()> Date(discount_end_date)||new Date()<Date(discount_start_date)){
    //         throw new BadRequestError("Invalid datetime")
    //     }
    //     console.log(discount_code)
    //     const results=findAllProducts({
    //         sort:'ctime',
    //         skip:+skip,
    //         limit:+limit,
    //         page:+page,
    //         filter:{
    //             _id:convertToObjectIdMongodb(shopId),
    //             isPublished:true
    //         }
    //     })
    //     return results
    // }
    static async GetProductByDiscountCode({ code,shopId}){
        const foundDiscount= await discountModel.findOne({
            discount_code:code,
            discount_shopId:convertToObjectIdMongodb(shopId)
        }).lean()
        
    
        if(!foundDiscount||!foundDiscount.discount_is_active){
            throw new NotFoundError("Discount not exists!")
        }
        const { discount_applies_to,discount_product_ids,discount_code,discount_shopId}=foundDiscount
        let products
        if(discount_applies_to==="all"){
            products= await findAllProducts({
                filter:{
                    product_shop:convertToObjectIdMongodb(shopId),
                    isPublished:true
                }
            })
        }
        if(discount_applies_to==="specific"){
            products=await findAllProducts({
                filter:{
                    _id:{$in:discount_product_ids},
                    isPublished:true
                }
               
            })
        }
        return products
    }
    static async GetDiscountCodeByShop({shopId}){
        const discounts = await findAllDiscountCodeUnselect({
            filter:{
                discount_shopId:convertToObjectIdMongodb(shopId),
                discount_is_active:true
            },
            unSelect:['_v','discount_shopId'],
            model:discountModel
        })
        return discounts
    }
    /* GetDiscountAmount payload
        "shopId":,
        "codeId":,
        "products":[
            {
                "productId":,
                "price":,
                "quantity":
            }
        ]
        
    */
    static async GetDiscountAmount({codeId,shopId,products}){
        
        const foundDiscount=await checkDiscountExists({
            model:discountModel,
            filter:{
                discount_code:codeId,
                discount_shopId:convertToObjectIdMongodb(shopId)
            }
        })
       
        if(!foundDiscount) throw new NotFoundError("Discount not exists")
        const {
            discount_is_active,
            discount_max_uses,
            discount_min_value_order,
            discount_end_date,
            discount_start_date,
            discount_type,
            discount_value,
            discount_applies_to,
            discount_product_ids
            // discount_max_uses_per_user
        }=foundDiscount
        if(!discount_is_active) throw new NotFoundError("discount expired")
        if (!discount_max_uses) throw new NotFoundError("discount are out of order")
        if(new Date()> Date(discount_end_date)){
            throw new NotFoundError("discount code expired")
        }
        if(new Date()>Date(discount_start_date)){
            throw new NotFoundError("discount not start yet")
        }
        
        let totalOrder=0
        if(discount_min_value_order>0){
            totalOrder=products.reduce((acc,product)=>{
                return acc+(product.quantity*product.price)
            },0)
            if(totalOrder<discount_min_value_order){
                throw new NotFoundError(`discount requires a minium value of ${discount_min_value_order} `)
            }
            // if(discount_max_uses_per_user>0){
                //     const userUserDiscount=discount_uses_used.find(user=>user.userId===userId)
                //     if(userUserDiscount){
                    //         //.......
                    //     }
                    // }
                    
        }
        let totalOrderwithDiscount=totalOrder
        if(discount_applies_to==='specific'){
            for(let i=0;i<products.length;i++){
                if(!discount_product_ids.includes((products[i].productId).toString())){
                    totalOrderwithDiscount=totalOrderwithDiscount-(products[i].quantity*products[i].price)
                }
            }

        }

        let amount
        if(discount_type==='fixed amount'){
            amount=discount_value
        }else{
            amount=(totalOrderwithDiscount*discount_value)/100
        }

        return {
            totalOrder,
            discount:amount,
            totalPrice:totalOrder-amount
        }
    }
    static async CancelDiscountCodeByCustomer({codeId,shopId,userId}){
        const foundDiscount=await checkDiscountExists({
            model:discountModel,
            filter:{
                discount_code:codeId,
                discount_shopId:convertToObjectIdMongodb(shopId)
            }
        })
        if(!foundDiscount) throw new NotFoundError("discount not exists")
        const result=await discountModel.findOneAndUpdate({discount_code:codeId},{
            $pull:{
                discount_uses_used:userId}},{new:true})
        return result
    }
    
    static async DeleteDiscountByShop({codeId,shopId}){
        const foundDiscount=await checkDiscountExists({
            model:discountModel,
            filter:{
                discount_code:codeId,
                discount_shopId:convertToObjectIdMongodb(shopId)
            }
        })
        if(!foundDiscount) throw new NotFoundError("discount not exists")
        const result=await discountModel.findOneAndUpdate({discount_code:codeId},{discount_is_active:false})
        return result
    }
                   
}


module.exports=DiscountService