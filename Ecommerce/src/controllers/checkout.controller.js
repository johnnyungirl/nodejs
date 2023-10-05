'use strict'

const { SuccessResponse } = require("../core/success.response")
const checkoutService = require("../services/checkout.service")

class CheckOutController{
    checkoutReview=async(req,res,next)=>{
        new SuccessResponse({
            message:"Checkout Success",
            metadata:await checkoutService.checkoutReview(req.body)
        }).send(res)
    }
    userOrder=async(req,res,next)=>{
        new SuccessResponse({
            messasge:"Checkout Success",
            metadata:await checkoutService.UserOrder(req.body)
        }).send(res)
    }
}

module.exports=new CheckOutController()