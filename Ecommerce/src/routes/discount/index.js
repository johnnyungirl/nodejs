'use strict'

const express=require('express')
const router=express.Router()
const {asyncHandler}=require('../../auth/checkAuth')
const discountController = require('../../controllers/discount.controller')
const{authentication}=require('../../auth/authUtils')
router.get('/products/:code',asyncHandler(discountController.getAllProductsByDiscountCode))
router.use(authentication)

router.post('',asyncHandler(discountController.createDiscount))
module.exports=router