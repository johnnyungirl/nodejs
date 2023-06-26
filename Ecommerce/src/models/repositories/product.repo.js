'use strict'

const { default: mongoose } = require("mongoose")
const { BadRequestError } = require("../../core/error.response")
const { product } = require("../product.model")
const { getSelectData, unGetSelectData } = require("../../utils")

const findAllDraftsForShop=async ({query,limit,skip})=>{
    return await product.find(query)
            .populate('product_shop','name email -_id')
            .sort({updateAt:-1})
            .skip(skip)
            .limit(limit)
            .lean()
            .exec()
}
const publishDrafts= async ({product_shop,product_id})=>{
    const foundShop= await product.findOne({
        product_shop: new mongoose.Types.ObjectId(product_shop),
        _id: new mongoose.Types.ObjectId(product_id)
    })
    if (!foundShop) return null
    foundShop.isDraft=false
    foundShop.isPublished=true
    const {modifiedCount}= await foundShop.updateOne(foundShop)
    return modifiedCount
}
const findAllPublishedForShop=async ({query,limit,skip}) => {
        return await product.find(query)
        .populate('product_shop','name email -_id')
        .sort({updateAt:-1})
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}
const unPublishProducts=async ({product_shop,product_id})=>{
        const foundShop=await product.findOne({
                product_shop:new mongoose.Types.ObjectId(product_shop),
                _id: new mongoose.Types.ObjectId(product_id)
        })
        if (!foundShop) return null
        foundShop.isDraft=true
        foundShop.isPublished=false
        const {modifiedCount}=await foundShop.updateOne(foundShop)
        return modifiedCount
}
const searchProductByUser=async ({keySearch})=>{
    const regexSearch = new RegExp(keySearch)
    const results=await product.find({
        isPublished:true,
        $text: {$search: regexSearch}
    },{score:{$meta:'textScore'} })
    .sort({score:{$meta:'textScore'} })
    .lean()

    return results
}
const findAllProducts=async ({sort,limit,page,skip,filter,select})=>{
    const sortBy=sort==='ctime' ? {_id:-1} :{_id:1}
    skip=(page-1)*limit
    const results=product.find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .select(getSelectData(select))
            .lean()
    
    return results
}
const findProducts=async({product_id,unSelect})=>{
    const results=product.findById(product_id).select(unGetSelectData(unSelect))
    return results
}
const updateProductById=async ({product_id,updatebody,model,isNew=true})=>{
        return await model.findByIdAndUpdate(product_id,updatebody,{new:isNew})
}   

module.exports={
    findAllDraftsForShop,
    publishDrafts,
    findAllPublishedForShop,
    unPublishProducts,
    searchProductByUser,
    findAllProducts,
    findProducts,
    updateProductById
}