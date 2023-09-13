
let a="leet"
let b="delete"
function sortString(array){ 
    const charArray=array.split('')
    charArray.sort()
    const sortedword=charArray.join('')
    return sortedword
}
function deleteUntilSame(str1, str2) {
    let i = 0;
    while (str1[i] === str2[i] && i < str1.length && i < str2.length) {
      i++;
    }
    return [str1.slice(i), str2.slice(i)];
}
const resulta=sortString(a)
const resultb=sortString(b)
const [result1,result2]=deleteUntilSame(resulta,resultb)
console.log(result1)
console.log(result2)
