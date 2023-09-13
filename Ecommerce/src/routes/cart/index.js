'use strict'
const express=require('express')
const router=express.Router()
const {asyncHandler}=require('../../auth/checkAuth')
const CartController=require('../../controllers/cart.controller')

router.post('/addtocart',asyncHandler(CartController.addToCart))

router.delete('/deleteitem',asyncHandler(CartController.deleteItem))

router.post('/update',asyncHandler(CartController.update))

router.get('/listcartitem',asyncHandler(CartController.listToCart))


module.exports=router