const { default: mongoose } = require("mongoose")


const convertToObjectMongoDB=async (str)=>{
    str=new mongoose.Types.ObjectId(str)
}
const num = 1234567890; // Example integer
console.log(convertToObjectMongoDB(num))