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
    static async GetAllProductsByDiscountCode({shopid,code,skip=0,page=0,limit=50}){
        const foundDiscount=await discountModel.findOne({
            discount_shopId:convertToObjectIdMongodb(shopid),
            discount_code:code
        })
        if(!foundDiscount ||!foundDiscount.discount_is_active){
            throw new BadRequestError("Invalid discount code")
        }
        if(new Date()>new Date(end_date)||new Date()<new Date(start_end))
            throw new BadRequestError("Invalid datetime")
        const results=findAllProducts({
            sort:'ctime',
            skip:+skip,
            limit:+limit,
            page:+page,
            filter:{
                _id:convertToObjectIdMongodb(shopid),
                isPublished:true
            }
        })
        return results
    }
    static async GetDiscountCodeWithProduct({ code,shopId,userId,limit,page}){
        const foundDiscount= await discountModel.findOne({
            discount_code:code,
            discount_shopId:convertToObjectIdMongodb(shopId)
        }).lean()
        if(!foundDiscount||!foundDiscount.discount_is_active){
            throw new NotFoundError("Discount not exists!")
        }
        const { discount_applies_to,discount_product_ids}=foundDiscount
        let products
        if(discount_applies_to=="all"){
            products= await findAllProducts({
                filter:{
                    product_shop:convertToObjectIdMongodb(shopId),
                    isPublished:true
                },
                limit:+limit,
                page:+page,
                sort:'ctime',
                select:['product_name']
            })
        }
        if(discount_applies_to=="specific"){
            products=await findAllProducts({
                filter:{
                    _id:{$in:discount_product_ids},
                    isPublished:true
                },
                limit:+limit,
                page:+page,
                sort:'ctime',
                select: ['product_name']
            })
        }
        return products
    }
    static async GetAllDiscountCodeByShop({limit,page,shopId}){
        const discounts = await findAllDiscountCodeUnselect({
            limit:+limit,
            page:+page,
            filter:{
                discount_shopId:convertToObjectIdMongodb(shopId),
                discount_is_active:true
            },
            unSelect:['_v','discount_shopId'],
            model:discounts
        })
        return discounts
    }
    static async GetDiscountAmount({codeId,userId,shopId,products}){
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
            discount_max_uses_per_user
        }=foundDiscount
        if(!discount_is_active) throw new NotFoundError("Discount expired")
        if (!discount_max_uses) throw new NotFoundError("Discount are out")
        if(new Date()> new Date(discount_end_date)){
            throw new NotFoundError("discount code expired")
        }
        if(new Date()> new Date(discount_start_date)){
            throw new NotFoundError("Discount not active yet")
        }
        let totalOrder=0
        if(discount_min_value_order>0){
            totalOrder=products.reduce((acc,product)=>{
                return acc+(products.quantity*product.price)
            },0)
            if(totalOrder<discount_min_value_order){
                throw new NotFoundError(`discount requires a minium value of ${discount_min_order_value} `)
            }
            if(discount_max_uses_per_user>0){
                const userUserDiscount=discount_uses_used.find(user=>user.userId===userId)
                if(userUserDiscount){
                    //.......
                }
            }
        }
        const amount =discount_type==='fixed amount ' ? discount_value: totalOrder *(discount_value/100)

        return {
            totalOrder,
            discount:amount,
            totalPrice:totalOrder-amount
        }
    }
    static async cancelDiscountCode({codeId,shopId,userId}){
        const foundDiscount=await checkDiscountExists({
            model:discountModel,
            filter:{
                discount_code:codeId,
                discount_shopId:convertToObjectIdMongodb(shopId)
            }
        })
        if(!foundDiscount) throw new NotFoundError("discount not exists")
        const result=await discountModel.findOneAndUpdate(foundDiscount._id,{
            $pull:{
                discount_uses_used:userId,
            },
            $inc:{
                discount_max_uses:1,
                discount_uses_used:-1
            }
        })
        return result
    }
                   
        }

module.exports=DiscountService