'use strict'

const express=require('express')
const router=express.Router()
const {asyncHandler}=require('../../auth/checkAuth')
const discountController = require('../../controllers/discount.controller')
const{authentication}=require('../../auth/authUtils')
router.get('/list_product_code',asyncHandler(discountController.GetAllDiscountCodeWithProducts))
router.get('/amount',asyncHandler(discountController.getDiscountAmount))
 
router.use(authentication)

router.post('',asyncHandler(discountController.createDiscount))
router.get('',asyncHandler(discountController.getAllDiscountCodes))

module.exports=router