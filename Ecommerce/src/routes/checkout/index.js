'use strict'
const express=require('express')
const { asyncHandler } = require('../../auth/checkAuth')
const checkoutController = require('../../controllers/checkout.controller')
const router=express.Router()

router.post('/review',asyncHandler(checkoutController.checkoutReview))
router.post('/order',asyncHandler(checkoutController.userOrder))
module.exports=router