const { convertToObjectIdMongodb } = require("../../utils")
const { cart } = require("../cart.model")
const { getProductById } = require("./product.repo")

const findCartById=async(cartId)=>{
    return await cart.find({cart_userId:cartId,cart_states:'active'}).lean()
}
const checkProductByServer=async(products)=>{
    return await Promise.all(products.map(async product=>{
        const foundProduct=await getProductById(product.productId)
        if (foundProduct){
            return {
                price:foundProduct.product_price,
                quantity:product.quantity,
                productId:foundProduct._id
            }
        }
    }))
}
module.exports={
    findCartById,
    checkProductByServer
}