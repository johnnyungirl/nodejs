'use strict'

const { BadRequestError } = require("../core/error.response")
const { product } = require("../models/product.model")
const { findCartById, checkProductByServer } = require("../models/repositories/cart.repo")
const { GetDiscountAmount } = require("./discount.service")

/* payload
    {
        userId,
        cartId,
        shop_order_ids:[
            shopId,
            item_products:[
                {
                    productId,
                    price,
                    quantity
                }
            ],
            shop_discounts:[
                {
                    shopId,
                    discountId,
                    codeId
                }
            ]
        ]
    }

*/
class CheckOutService{
    static async checkoutReview({userId,cartId,shop_order_ids}) {
        const foundCart=findCartById(cartId)
        if(!foundCart) throw BadRequestError("Cart does not exists")
        const checkout_order={totalPrice:0,feeship:0,totalDiscount:0,totalCheckOut:0}
        const shop_order_ids_new=[]
        for (let i = 0; i < shop_order_ids.length; i++) {
            const {shopId,item_products=[],shop_discounts=[]}=shop_order_ids[i]
            const checkProductServer=await checkProductByServer(item_products)
            console.log(`checkProductServer::`,checkProductServer)
            if(!checkProductServer) throw BadRequestError('order wrong')
            const checkOutPrice= await checkProductServer.reduce((acc,product)=>{
                    return acc+(product.quantity*product.price)
                },0)
            checkout_order.totalPrice=+checkOutPrice
            const ItemCheckOut={
                shopId,
                shop_discounts,
                priceRaw:checkOutPrice,
                priceApplyDiscount:checkOutPrice,
                item_products:checkProductServer
            }
            if(shop_discounts.length>0){
                const {totalPrice=0,discount=0}=await GetDiscountAmount({
                    codeId:shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products:checkProductServer
                })
                checkout_order.totalDiscount+=discount
                if(discount>0){
                    ItemCheckOut.priceApplyDiscount=checkOutPrice-discount
                }
            }
            checkout_order.totalPrice+=ItemCheckOut.priceApplyDiscount
            shop_order_ids_new.push(ItemCheckOut)
        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

}
module.exports= CheckOutService