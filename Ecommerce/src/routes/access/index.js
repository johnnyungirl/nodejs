'use strict'
const express=require('express')
const AccessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')
const router=express.Router()
//signUp
router.post('/shop/signup',asyncHandler(AccessController.signUp))
router.post('/shop/login',asyncHandler(AccessController.logIn))
router.use(authentication)
router.post('/shop/logout',asyncHandler(AccessController.logOut))
router.post('/shop/handleRefreshToken',asyncHandler(AccessController.handleRefreshToken))

module.exports=router