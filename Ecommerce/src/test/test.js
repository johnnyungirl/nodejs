const shop_product_ids=[
    {
        cartId:3,
        shopId:123,
        product_item:[
            {
                productId:1,
                quantity:1,
                price:100
            },{
                productId:2,
                quantity:2,
                price:200
            },{
                productId:3,
                quantity:3,
                price:300
            }
        ]
    },
    {
        cartId:1,
        shopId:321,
        product_item:[
            {
                productId:1,
                quantity:1,
                price:100
            },{
                productId:2,
                quantity:2,
                price:200
            },{
                productId:3,
                quantity:3,
                price:300
            }
        ]
    }
]
let totalcheckout=0
let totalprice=0
for (let i = 0; i < shop_product_ids.length; i++) {
    const {product_item}=shop_product_ids[i]
    totalprice=product_item.reduce((acc,product)=>{
        return acc+(product.quantity*product.price)
    },0)
    totalcheckout+=totalprice
}
console.log(totalcheckout)
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