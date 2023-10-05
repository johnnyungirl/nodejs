'user strict'

const { convertToObjectIdMongodb } = require("../../utils")
const inventoryModel = require("../inventory.model")

const reservationInventory=async(productId,quantity,cartId)=>{
    const query={
        inven_productId:convertToObjectIdMongodb(productId),
        inven_stock:{$gte:quantity}
    }
    const updateSet={
        $inc:{
            inven_stock:-quantity,

        },
        $push:{
            inven_reservations:{
                'quantity':quantity,
                'cartId':cartId,
                'CreateOn':new Date()
            }
        }
    }
    const options={upsert:true,new :true}
    return await inventoryModel.updateOne(query,updateSet,options)
}
module.exports={
    reservationInventory
}
