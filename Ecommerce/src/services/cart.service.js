const { NotFoundError } = require("../core/error.response")
const { cart } = require("../models/cart.model")
const { getProductById } = require("../models/repositories/product.repo")


class CartService{
    static async createUserCart({userId,products}){
        const query={cart_userId:userId,cart_states:'active'}
        const update={
            $addToSet:{
                cart_product:products
            }
        }
        const options ={upsert:true,new:true}
        return await cart.findOneAndUpdate(query,update,options)
    }
    static async UpdateCartItemQuantity({userId,products}){
        const {productId,quantity}=products
        const query={
            cart_userId:userId,
            'cart_product.productId':productId,
            cart_states:'active'
        }
        const update={
            $inc:{
                'cart_product.$.quantity':quantity
            }
        }
        const options={
            upsert:true,new:true
        }
        return await cart.findOneAndUpdate(query,update,options)
    }
    static async addToCart({userId,products={}}){
        const foundCart=await cart.findOne({cart_userId:userId})
        if(!foundCart){
            return await CartService.createUserCart({userId,products})
        }
        if(!foundCart.cart_product.length){
            foundCart.cart_product=[products]
            return await foundCart.save()
        }
        return CartService.UpdateCartItemQuantity({userId,products})

    }
    /*
        shop_order_ids:[
            {
                shopId,
                item_products:[
                    {
                        quantity,
                        price,
                        shopId,
                        old_quantity,
                        productId
                    }
                ],
                version
            }
        ]

     */
    static async addToCartV2({userId,shop_order_ids}){
        const {productId,quantity,old_quantity}=shop_order_ids[0]?.item_products[0]
        const foundProduct=await getProductById(productId)
        if(!foundProduct) throw new NotFoundError('')
        if(foundProduct.product_shop.toString()!==shop_order_ids[0]?.shopId){
            throw new NotFoundError('Product do not belong to shop ')
        }
        if (quantity===0){
            CartService.deleteItemUserCart({userId,productId})
        }
        return await CartService.UpdateCartItemQuantity({
            userId,
            products:{
                productId,
                quantity:quantity-old_quantity
            }
        })
    }
    static async deleteItemUserCart({userId,productId}){
        const query={cart_userId:userId,cart_states:'active'}
        const update={
            $pull:{
                cart_product:{
                    productId
                }
            }
        }
        const deleteCart=await cart.updateOne(query,update)
        return deleteCart

    }
    static async getListUserCart({userId}){
        return await cart.findOne({
            cart_userId:+userId
        }).lean()
    }
}
module.exports=CartService