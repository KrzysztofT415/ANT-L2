const bigInt = require('big-integer')

const binExtGCD = (a, b) => {
    let g = bigInt.one
    while (a.isEven() && b.isEven()) [a, b, g] = [a.divide(2), b.divide(2), g.times(2)]

    let [a2, b2, A, B, C, D] = [bigInt(a), bigInt(b), bigInt.one, bigInt.zero, bigInt.zero, bigInt.one]
    while (!a2.isZero()) {
        while (a2.isEven()) {
            a2 = a2.divide(2)
            if (A.isEven() && B.isEven()) [A, B] = [A.divide(2), B.divide(2)]
            else [A, B] = [A.add(b).divide(2), B.subtract(a).divide(2)]
        }

        while (b2.isEven()) {
            b2 = b2.divide(2)
            if (C.isEven() && D.isEven()) [C, D] = [C.divide(2), D.divide(2)]
            else [C, D] = [C.add(b).divide(2), D.subtract(a).divide(2)]
        }

        if (b2.greater(a2)) [b2, C, D] = [b2.subtract(a2), C.subtract(A), D.subtract(B)]
        else [a2, A, B] = [a2.subtract(b2), A.subtract(C), B.subtract(D)]
    }

    return { x: C, y: D, gcd: g.times(b2) }
}
const modInv = (a, m) => binExtGCD(a, m).x

// reading arguments or generating values

if ([2, 4].indexOf(process.argv.length) == -1) return console.log('Missing input')
let [a, b] = [0, 0]
if (process.argv.length == 2) {
    const googol = bigInt('1e100')
    const randBigNum = _ => bigInt.randBetween(bigInt('<1>0', googol), bigInt('<10>0', googol))
    do {
        ;[a, b] = [randBigNum(), randBigNum()]
    } while (bigInt.gcd(a, b) != 1)
    if (b.greater(a)) [a, b] = [b, a]
} else [a, b] = [bigInt(process.argv[2]), bigInt(process.argv[3])]

// testing and measuring procedure

console.log(`> example:\n   a: ${a}\n   b: ${b}\n`)

const res = binExtGCD(a, b)
console.log(`> binary extended gcd:\n   x: ${res.x}\n   y: ${res.y}\n gcd: ${res.gcd}`)
console.log(`\tx|   ${res.x}\n\ta|   * ${a}\n\ty|     + ${res.y}\n\tb|       * ${b}\n\t\t == ${res.gcd} |  |   real = ${bigInt.gcd(a, b)}`)
if (res.gcd != 1) return console.log('gcd != 1')

console.log('\n> modular inverse: ')
console.time('~ time of calculations: ')
const a2 = modInv(a, b)
console.timeEnd('~ time of calculations: ')
console.log(`  a': ${a2}`)
console.log(`\ta|   ${a}\n       a'|   * ${a2}\n\t     ==\n   a * a'|   ${a.times(a2)}\n\t   ==\n\tb|   ${b}\n\ta|   * ${a.times(a2).divide(b)}\n\t       + 1\n    mod b|\t == 1 mod ${b}`)
