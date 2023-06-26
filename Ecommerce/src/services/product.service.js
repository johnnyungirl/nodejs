const { update } = require("lodash")
const { BadRequestError } = require("../core/error.response")
const { product, electronic,clothing, furniture } = require('../models/product.model')
const { inserInventory } = require("../models/repositories/inventory.repo")
require('../core/error.response')
const {findAllDraftsForShop, publishDrafts, findAllPublishedForShop, unPublishProducts, searchProductByUser, findAllProducts, findProducts, updateProductById}=require('../models/repositories/product.repo')
const { updateNestedObjectParser, removeUndefinedObject } = require("../utils")
require('../models/repositories/inventory.repo')
class ProductFactory{
    
    static productRegistry={}

    static RegistryProductType(type,classRef){
        ProductFactory.productRegistry[type]=classRef
    }
    
    static async createProduct(type,payload){
        const productClass=ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)
        return new productClass(payload).createProduct() 
    }
    static async updateProduct(type,product_id,payload){
        const productClass=ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)
        return new productClass(payload).updateProduct(product_id)
    }
    //  QUERY //
    static async findAllDraftsForShop({product_shop,limit=50,skip=0}){
            const query={product_shop,isDraft:true}
            return await findAllDraftsForShop({query,limit,skip})
    }
    static async publishDrafts({product_shop,product_id}){
            return await publishDrafts({product_shop,product_id})
    }
    static async findAllPublishedForShop({product_shop,limit=50,skip=0}){
            const query={product_shop,isPublished:true}
            return await findAllPublishedForShop({query,limit,skip})
    }
    static async unPublishProducts({product_shop,product_id}){
            return await unPublishProducts({product_shop,product_id})
    }
    static async searchProductByUser({keySearch}){
        return await searchProductByUser({keySearch})
    }
    static async findAllProducts({sort='c-time',limit=50,page=1,skip=0,filter={isPublished:true}}){
        return await findAllProducts({sort,limit,page,skip,filter,
            select:['product_name','product_price','product_thumb']
        })
    }
    static async findProducts({product_id}){
        return await findProducts({product_id,
            unSelect:['__v']
        })
    }
    // END QUERY //
}
class Product{
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes
    }){
        this.product_name=product_name
        this.product_thumb=product_thumb
        this.product_description=product_description
        this.product_price=product_price
        this.product_quantity=product_quantity
        this.product_type=product_type
        this.product_shop=product_shop
        this.product_attributes=product_attributes
    }
    async createProduct(product_id){
        const newProduct= await product.create({...this,_id:product_id})
        if(newProduct){
            await inserInventory({
                productId:newProduct._id,
                shopId:this.product_shop,
                stock:this.product_quantity
            })
        }
        return newProduct
    }
    async updateProduct(product_id,updatebody){
        return await updateProductById({product_id,updatebody,model:product})
    }
}
class Electronic extends Product{
    async createProduct(){
        const newElectronic=await electronic.create({
            ...this.product_attributes, product_shop:this.product_shop})
        if(!newElectronic) throw new BadRequestError("create electronic attributes error")
        const newProduct=await super.createProduct(newElectronic._id)
        if(!newProduct) throw new BadRequestError("create electronic product error")
        return newProduct

    }   
    async updateProduct(product_id){
            const updateParams=removeUndefinedObject(this)
        if(updateParams.product_attributes){
            await updateProductById({
                product_id,
                updatebody:updateNestedObjectParser(updateParams.product_attributes),
                model:electronic
            })
        }
        const updateProduct=await super.updateProduct(product_id,updateNestedObjectParser(updateParams))
        return updateProduct
    }
}
const final={}
const updateNestedObjectParse=obj=>{
    Object.keys(obj).forEach(k=>{
        if(typeof obj[k]=='object' &&!Array.isArray(obj[k])){
            const response=updateNestedObjectParse(obj[k])
            Object.keys(response).forEach(a=>{
                final[`${k}.${a}`]=response[a]
            })
        }else{
            final[k]=obj[k]
        }
    })
}
class Clothing extends Product{
    async createProduct(){
        const newClothing=await clothing.create({
            ...this.product_attributes, product_shop:this.product_shop})
        if(!newClothing) throw new BadRequestError("create clothing attributes error")
        const newProduct=await super.createProduct(newClothing._id)
        if(!newProduct) throw new BadRequestError("create clothing product error")
        return newProduct
    }
    async updateProduct(product_id){
            const updateParams=removeUndefinedObject(this)
        if(updateParams.product_attributes){
            await updateProductById({   
                product_id,
                updatebody:updateNestedObjectParser(updateParams.product_attributes),
                model:clothing
            })
        }
        const updateProduct=await super.updateProduct(product_id,updateNestedObjectParser(updateParams))
        return updateProduct
    }
}
class Furniture extends Product{
    async createProduct(){
        const newfurniture=await furniture.create({...this.product_attributes, product_shop:this.product_shop})
        if(!newfurniture) throw new BadRequestError("Create furniture attributes error")
        const newProduct= await super.createProduct(newfurniture._id)
        if(!newProduct) throw new BadRequestError("Create product furniture error")
        return newProduct
    }
}
ProductFactory.RegistryProductType('Electronics',Electronic)
ProductFactory.RegistryProductType('Clothing',Clothing)
ProductFactory.RegistryProductType('Furniture',Furniture)  
module.exports=ProductFactory