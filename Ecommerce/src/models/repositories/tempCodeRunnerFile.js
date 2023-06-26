const { default: mongoose } = require("mongoose")


const convertToObjectMongoDB=async (str)=>{
    str=mongoose.Types.ObjectId(str)
}
console.log(str)