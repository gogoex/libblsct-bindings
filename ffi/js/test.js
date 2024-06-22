const blsct = require('./build/Release/blsct')

blsct.blsct_init()

const point = new Uint8Array(blsct.POINT_SIZE)
blsct.blsct_gen_random_point(point)

