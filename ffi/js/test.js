const api = require('./dist/api')
const {
  AmtRecoveryReq,
  Computation,
} = api
const blsct = require('./build/Release/blsct')

const C = new Computation()

// scalar
const scalar = C.Scalar(1234)
console.log(scalar.toNumber())

// point
const point = C.Point()

// pubkey, dpk
const pk1 = C.PublicKey()
const pk2 = C.PublicKey()
const dpk = C.DoublcPublicKeyfromPubKeys(pk1, pk2)

// decode address
{
  const enc_addr1 = "nv1jlca8fe3jltegf54vwxyl2dvplpk3rz0ja6tjpdpfcar79cm43vxc40g8luh5xh0lva0qzkmytrthftje04fqnt8g6yq3j8t2z552ryhy8dnpyfgqyj58ypdptp43f32u28htwu0r37y9su6332jn0c0fcvan8l53m"
  const dpk = C.decodeAddress(enc_addr1)
  const enc_addr2 = C.encodeAddress(dpk)
  console.log(`recovered enc addr ${enc_addr2}`)
}

// encode address
{
  const pk1 = C.PublicKey()
  const pk2 = C.PublicKey()
  const dpk = C.DoublcPublicKeyfromPubKeys(pk1, pk2)
  const enc_addr = C.encodeAddress(dpk)
  console.log(`recovered enc addr: ${enc_addr}`)
}

// token id
{
    const token_id1 = C.TokenId()
    const token_id2 = C.TokenId(2323)
    const token_id3 = C.TokenId(23, 45)
}

// range proof
for(let i=0; i<1; ++i) {
  process.stdout.write('.')

  // prove
  const nonce1 = C.Point()
  const rp1 = C.buildRangeProof(
    [456],
    nonce1,
    'navcoin'
  )
  const nonce2 = C.Point()
  const rp2 = C.buildRangeProof(
    [123, 234, 345, 456],
    nonce2,
    'navio'
  )

  // verify
  const veriRes = C.verifyRangeProof([rp1, rp2])
  if (!veriRes) {
    console.log(`Range proof verification failed at i=${i}`)
    break
  }

  // amount recovery
  const reqs = [
    new AmtRecoveryReq(rp1, nonce1),
    new AmtRecoveryReq(rp2, nonce2),
  ]
  const res = C.recoverAmount(reqs)
  console.log(`Recovery result ${res}`)
}

C.runGC()


// tx
{
  console.log('in tx test')
  // const crypto = require('crypto')
  // 
  // const txid_buf = crypto.randomBytes(32).toString('hex')
  // 
  // console.log(txid_buf);
}
console.log('done')
