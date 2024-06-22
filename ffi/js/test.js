const blsct = require('./build/Release/blsct')

blsct.blsct_init()

const scalar = blsct.blsct_gen_scalar(1234)

const n = blsct.blsct_scalar_to_uint64(scalar)
console.log(n)

blsct.blsct_delete_scalar(scalar)
