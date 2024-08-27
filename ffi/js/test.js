const {
  Computation,
  AmtRecoveryReq,
} = require('./dist/computation.js')

const C = new Computation()

// scalar
const scalar = C.Scalar(1234)
console.log(scalar.toNumber())

// point
const point = C.RandomPoint()

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
  const nonce1 = C.RandomPoint()
  const rp1 = C.buildRangeProof(
    [456],
    nonce1,
    'navcoin'
  )
  const nonce2 = C.RandomPoint()
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

// tx
{
  const numTxIn = 1
  const numTxOut = 1
  const defaultFee = 200000
  const fee = (numTxIn + numTxOut) * defaultFee
  const outAmount = 10000
  const inAmount = fee + outAmount

  // tx in
  const crypto = require('crypto')
  const txId = crypto.randomBytes(32).toString('hex')
   
  const gamma = 100
  const spendingKey = C.Scalar(12)
  const tokenId = C.TokenId()
  const outIndex = 0
  const outPoint = C.OutPoint(txId, outIndex)

  const txIn = C.TxIn(
    inAmount,
    gamma,
    spendingKey,
    tokenId,
    outPoint,
  )

  // tx out
  const pk1 = C.PublicKey()
  const pk2 = C.PublicKey()
  const dpk = C.DoublcPublicKeyfromPubKeys(pk1, pk2)
  const subAddr = C.SubAddress(dpk)

  const txOut = C.TxOut(
    subAddr,
    outAmount,
    'test-txout' ,
  )

  const tx = C.Tx(
    [txIn],
    [txOut],
  )

  const tx_hex = tx.serialize()
  const tx2 = tx.deserialize(tx_hex)

  const assert = require('assert')
  assert(tx.serialize() === tx2.serialize())

  const txIns = tx2.getTxIns()
  console.log(`# of txIns: ${txIns.length}`)
   
  const txOuts = tx2.getTxOuts()
  console.log(`# of txOuts: ${txOuts.length}`)

  for(const txOut of txOuts) {
    console.log(`value: ${txOut.getValue()}`)
    console.log(`token_id: token=${txOut.getTokenId().getToken()}, subid=${txOut.getTokenId().getSubid()}`)

    console.log(`spendingKey: ${txOut.getSpendingKey().toHex()}`)
    console.log(`ephemeralKey: ${txOut.getEphemeralKey().toHex()}`)
    console.log(`blindingKey: ${txOut.getBlindingKey().toHex()}`)
    console.log(`viewTag: ${txOut.getViewTag()}`)
  }
}

console.log('done')

C.runGC()
