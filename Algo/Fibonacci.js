
const fibonacciArray=[]
fibonacciArray[0]=0
fibonacciArray[1]=1
for (i=2;i<30;i++){
    fibonacciArray[i]=fibonacciArray[i-1]+fibonacciArray[i-2]
}
console.log(fibonacciArray)