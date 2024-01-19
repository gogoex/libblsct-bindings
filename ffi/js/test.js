const blsct = require('./build/Release/blsct')

blsct.BlsInit()
const res = blsct.TestAddition()
console.log(res)
