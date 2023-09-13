const { convertToObjectIdMongodb } = require("../../utils")
const { cart } = require("../cart.model")
const { getProductById } = require("./product.repo")

const findCartById=async (cartId)=>{
    return await cart.findById({_id:convertToObjectIdMongodb(cartId),cart_states:'active'}).lean()
}
const checkProductByServer=async(products)=>{
    return await Promise.all(products.map(async product=>{
        const foundProduct=await getProductById(product.productId)
        if (foundProduct){
            return {
                price:foundProduct.product_price,
                quantity:foundProduct.quantity,
                productId:foundProduct.productId
            }
        }
    }))
}
module.exports={
    findCartById,
    checkProductByServer
}