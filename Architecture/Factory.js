class Drink{
    constructor(types='alcoholic',name="vodka",price="29$"){
        this.types=types
        this.name=name
        this.price=price
    }
}
class Services{
    transPortClass=Drink
    getServices=()=>{
        return new this.transPortClass()
    }
}
class Food{
    constructor(types='main dishes',name='beefsteak',price='50$'){
        this.types=types
        this.name=name
        this.price=price
    }
}
class FoodService extends Services{
    transPortClass=Food
}    
const services=new Services()
console.log(services.getServices())
const foodServices=new FoodService()
console.log(foodServices.getServices())