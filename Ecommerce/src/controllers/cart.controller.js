'use strict'

const { SuccessResponse } = require("../core/success.response")
const CartService=require('../services/cart.service')
class CartController{
    addToCart=async (req,res,next)=>{
        new SuccessResponse({
            message:'Create new cart success',
            metadata:await CartService.addToCart(req.body)

        }).send(res)
    }
    update=async (req,res,next)=>{
        new SuccessResponse({
            message:'Create new Cart success',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }
    deleteItem=async (req,res,next)=>{
        new SuccessResponse({
            message:'deleted  Item Cart Success',
            metadata:await CartService.deleteItemUserCart(req.body)
        }).send(res)
    }
    listToCart=async(req,res,next)=>{
        new SuccessResponse({
            message:'list cart success',
            metadata:await CartService.getListUserCart(req.query)
        }).send(res)

    }

}
module.exports=new CartController()