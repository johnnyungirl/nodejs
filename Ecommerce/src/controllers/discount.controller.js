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
    getAllDiscountCodes=async (req,res,next)=>{
        new SuccessResponse({
            message:'Successful Code Found',
            metadata:await DiscountService.GetAllDiscountCodeByShop({
                ...req.query,
                shopId:req,user,userId
            })
        }).send(res)
    }
    getDiscountAmount=async (req,res,next)=>{
        new SuccessResponse({
            message:'Successful Code Found',
            metadata:await DiscountService.GetDiscountAmount({
                ...req.body,
            })
        }).send(res)
    }
    GetAllDiscountCodeWithProducts=async (req,res,next)=>{
        new SuccessResponse({
            message:'Successful Code Found',
            metadata:await DiscountService.GetAllDiscountCodeByShop({
                ...req.query,
            })
        }).send(res)
    }
}
module.exports= new DiscountController()