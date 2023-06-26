'use strict'

const { SuccessResponse } = require('../core/success.response')
const DiscountService = require('../services/discount.service')
class DiscountController{
    createDiscount=async(req,res,next)=>{
        new SuccessResponse({
            message:"Create Discount Success",
            metadata: await DiscountService.CreateDiscount({...req.body,shopId:req.user.userId})
        }).send(res)
    }
    getAllProductsByDiscountCode=async(req,res,next)=>{
        new SuccessResponse({
            message:"get list products by discount code success",
            metadata:await DiscountService.GetAllProductsByDiscountCode(r)
        }).send(res)
    }
}
module.exports= new DiscountController()