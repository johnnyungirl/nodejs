'use strict'

const { NotFoundError, BadRequestError } = require("../core/error.response")
const discountModel = require("../models/discount.model")
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
    
}

module.exports=DiscountService