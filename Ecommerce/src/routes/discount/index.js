'use strict'

const express=require('express')
const router=express.Router()
const {asyncHandler}=require('../../auth/checkAuth')
const discountController = require('../../controllers/discount.controller')


const{authentication}=require('../../auth/authUtils')
router.get('/amount',asyncHandler(discountController.getDiscountAmount))
router.get('/productsbydiscount',asyncHandler(discountController.getProductsByDiscountCode))
router.use(authentication)
router.post('/canceldiscount',asyncHandler(discountController.cancelDiscountCode))
router.post('/create',asyncHandler(discountController.createDiscount)) 
router.get('/all',asyncHandler(discountController.getAllDiscountCode))
router.post('/deletediscount',asyncHandler(discountController.deleteDiscountCodeByShop))

module.exports=router