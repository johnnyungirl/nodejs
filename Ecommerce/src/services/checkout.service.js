'use strict'

const { BadRequestError } = require("../core/error.response")
const orderModel = require("../models/order.model")
const { findCartById, checkProductByServer } = require("../models/repositories/cart.repo")
const CartService = require("./cart.service")
const { GetDiscountAmount } = require("./discount.service")
const { releaseLock,acquireLock } = require("./redis.service")

/* payload
    {
        userId,
        cartId,
        shop_order_ids:[
            {
                shopId,
                item_products:[
                    {
                        productId,
                        price,
                        quantity
                    },
                    {
                        productId,
                        price,
                        quantity
                    },
                    {
                        productId,
                        price,
                        quantity
                    },
                ],
                shop_discounts:[
                    {
                        shopId,
                        discountId,
                        codeId
                    }
                ]
            }
        ]    
    }

*/
class CheckOutService{
    static async checkoutReview({cartId,shop_order_ids}) {
        const foundCart=await findCartById(cartId)
        if(!foundCart) throw new BadRequestError("Cart does not exists")
        const checkout_order={totalPrice:0,feeship:0,totalDiscount:0,totalCheckOut:0}
        const shop_order_ids_new=[]
        for (let i = 0; i < shop_order_ids.length; i++) {
            const {shopId,item_products=[],shop_discounts=[]}=shop_order_ids[i]
            const checkProductServer=await checkProductByServer(item_products)
            if(!checkProductServer) throw new BadRequestError('order wrong')
            const checkOutPrice= await checkProductServer.reduce((acc,product)=>{
                    return acc+(product.quantity*product.price)
                },0)
            
            const ItemCheckOut={
                shopId,
                shop_discounts,
                priceRaw:checkOutPrice,
                priceApplyDiscount:checkOutPrice,
                item_products:checkProductServer
            }
            if(shop_discounts.length>0){
                //gia su chi co 1 discount code
                const {discount}=await GetDiscountAmount({
                    codeId:shop_discounts[0].codeId,
                    shopId,
                    products:checkProductServer
                })
                checkout_order.totalDiscount+=discount
                if(discount>0){
                    ItemCheckOut.priceApplyDiscount=checkOutPrice-discount
                }
            }
            checkout_order.totalCheckOut+=ItemCheckOut.priceApplyDiscount
            checkout_order.totalPrice+=ItemCheckOut.priceRaw
            shop_order_ids_new.push(ItemCheckOut)
        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }
    //order
    static async UserOrder({userId,cartId,shop_order_ids}){
        const {shop_order_ids_new,checkout_order}=  await CheckOutService.checkoutReview({cartId,shop_order_ids})
        const products=shop_order_ids_new.flatMap(order=>order.item_products)
        const acquireLocks=[]
        for(let i=0;i<products.length;i++){
            const {productId,quantity}=products[i]
            console.log(productId)
            const key = await acquireLock(productId,quantity,cartId)
            acquireLocks.push(key ? true:false)
            
            if(key){

                await releaseLock(key)
            }
        }
        if(acquireLocks.includes(false)){
            throw new BadRequestError('Da co 1 so thay doi trong san pham, xin vui long kiem tra lai .....')
            
            }

        const newOrder= orderModel.create({
            order_userId:userId,
            order_checkout:checkout_order,
            order_products:shop_order_ids_new
        })
        if(newOrder){
            products.forEach(product=>{CartService.deleteItemUserCart(userId,product)})
        }
    }
    /*
        1.Query Order[Users]
    */
   static async getOrderByUser(){

   }
     /*
        2.Query Order Using Id[Users]
    */
        static async getOneOrderByUser(){
    
        }
    /*
        3.Cancel Order[Users]
    */
   static async cancalOrderByUser(){
    
   }
    /*
        4.Update Order Status [Shop |Admin]
    */
    static async updateOrderStatusByShop(){
    
    }      

}
module.exports= CheckOutService