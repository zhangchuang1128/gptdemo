const str_ = 'Ajjjbatfvdcabcd000006789abcxxx0000gggg00123'

let orderMatch = 15
let orderNumber = str_.slice(orderMatch, 27)

console.log(orderNumber)

while (orderNumber.startsWith('0') && orderMatch <= 27) {
    orderNumber = str_.slice(orderMatch++, 27)
}

console.log(orderNumber)
