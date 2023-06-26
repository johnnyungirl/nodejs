'use strict'
const { SuccessResponse } = require("../core/success.response")
const ProductService = require("../services/product.service")
class ProductController{
    createProduct=async (req,res,next)=>{
        new SuccessResponse({
            message:'Create Product Success',
            metadata: await ProductService.createProduct(req.body.product_type,{...req.body,product_shop:req.user.userId})
        }).send(res)
            
    }
    // QUERY //
    getAllDraftsForShop=async (req,res,next)=>{
        new SuccessResponse({
            message:"Get List Success",
            metadata: await ProductService.findAllDraftsForShop({
                product_shop:req.user.userId
            })
        }).send(res)
}   
    publishDrafts=async (req,res,next)=>{
        new SuccessResponse({
            message:"Published Product Success",
            metadata: await ProductService.publishDrafts({
                product_shop:req.user.userId,
                product_id:req.params.id
            })
        }).send(res)
    }
    getAllPublishedForShop=async(req,res,next)=>{
        new SuccessResponse({
            message:"Get list published success",
            metadata: await ProductService.findAllPublishedForShop({
                product_shop: req.user.userId
            })
        }).send(res)     
    }
    unPublishProducts= async(req,res,next)=>{
        new SuccessResponse({
            message:"Unpublish products success",
            metadata: await ProductService.unPublishProducts({
                product_shop:req.user.userId,
                product_id:req.params.id
            })
        }).send(res)
    }
    getListSearchProducts=async(req,res,next)=>{
        new SuccessResponse({
            message:"Search Products Successs",
            metadata: await ProductService.searchProductByUser(req.params)
        }).send(res)
    }
    getAllProducts= async(req,res,next)=>{
        new SuccessResponse({
            message:"Get All Products Success",
            metadata:await ProductService.findAllProducts(req.query)
        }).send(res)
    }
    getProducts=async(req,res,next)=>{
        new SuccessResponse({
            message:"get products Success",
            metadata:await ProductService.findProducts({
                product_id:req.params.product_id
            })
        }).send(res)
    }
    updateProduct=async (req,res,next)=>{
        new SuccessResponse({
            message:"update success",
            metadata: await ProductService.updateProduct(
                req.body.product_type,
                req.params.product_id,{
                ...req.body,
                product_shop:req.user.userId
            })
        }).send(res)
    }
   //END QUERY //
}
module.exports=new ProductController()