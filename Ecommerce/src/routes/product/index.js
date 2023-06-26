'use strict'
const express=require('express')
const router=express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')
const productController = require('../../controllers/product.controller')

router.get('/all',asyncHandler(productController.getAllProducts))
router.get('/search/:keySearch',asyncHandler(productController.getListSearchProducts))
router.get('/:product_id',asyncHandler(productController.getProducts))

router.use(authentication)

router.post('',asyncHandler(productController.createProduct))

router.patch('/:product_id',asyncHandler(productController.updateProduct))
//QUERY
router.get('/drafts/all',asyncHandler(productController.getAllDraftsForShop))

router.get('/published/all',asyncHandler(productController.getAllPublishedForShop))

router.post('/drafts/publish/:id',asyncHandler(productController.publishDrafts))

router.post('/published/unpublish/:id',asyncHandler(productController.unPublishProducts))


//END QUERY
module.exports=router