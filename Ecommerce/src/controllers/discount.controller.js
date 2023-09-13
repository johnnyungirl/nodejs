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
    getAllDiscountCode=async (req,res,next)=>{
        new SuccessResponse({
            message:'list discount code success',
            metadata:await DiscountService.GetDiscountCodeByShop({
                shopId:req.user.userId
            })
        }).send(res)
    }
    getDiscountAmount=async (req,res,next)=>{
        new SuccessResponse({
            message:'get discount amount success',
            metadata:await DiscountService.GetDiscountAmount({
                ...req.body,
                shopId:req.body.shopId,
                codeId:req.body.codeId
            })
        }).send(res)
    }
   
    getProductsByDiscountCode=async(req,res,next)=>{
        new SuccessResponse({
            message:"get products success",
            metadata:await DiscountService.GetProductByDiscountCode({
                shopId:req.body.shopId,
                code:req.body.discount_code
            })
        }).send(res)
            
    }
    cancelDiscountCode=async(req,res,next)=>{
        new SuccessResponse({
            message:"get products success",
            metadata:await DiscountService.CancelDiscountCodeByCustomer({
                codeId:req.body.discount_code,
                shopId:req.user.userId,
                userId:req.body.userId
            })
        }).send(res)
    }
    deleteDiscountCodeByShop=async(req,res,next)=>{
        new SuccessResponse({
            message:"delete discount code success",
            metadata:await DiscountService.DeleteDiscountByShop({
                codeId:req.body.discount_code,
                shopId:req.user.userId
            })
        }).send(res)
    }
}
module.exports= new DiscountController()