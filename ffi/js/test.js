const api = require('./dist/api')
const {
  Computation,
} = api
const blsct = require('./build/Release/blsct')

const C = new Computation()

// scalar
const scalar = C.getScalar(1234)
console.log(scalar.toNumber())

// point
const point = C.getPoint()

// pubkey, dpk
const pk1 = C.getPublicKey()
const pk2 = C.getPublicKey()
const dpk = C.getDoublcPublicKeyfromPubKeys(pk1, pk2)

// decode address
{
  const enc_addr1 = "nv1jlca8fe3jltegf54vwxyl2dvplpk3rz0ja6tjpdpfcar79cm43vxc40g8luh5xh0lva0qzkmytrthftje04fqnt8g6yq3j8t2z552ryhy8dnpyfgqyj58ypdptp43f32u28htwu0r37y9su6332jn0c0fcvan8l53m"
  const dpk = C.decodeAddress(enc_addr1)
  const enc_addr2 = C.encodeAddress(dpk)
  console.log(`recovered enc addr ${enc_addr2}`)
}

// encode address
{
  const pk1 = C.getPublicKey()
  const pk2 = C.getPublicKey()
  const dpk = C.getDoublcPublicKeyfromPubKeys(pk1, pk2)
  const enc_addr = C.encodeAddress(dpk)
  console.log(`recovered enc addr: ${enc_addr}`)
}

// token id
{
    const token_id1 = C.getTokenId()
    const token_id2 = C.getTokenId(2323)
    const token_id3 = C.getTokenId(23, 45)
}

C.cleanUp()

// range proof
for(let i=0; i<1; ++i) {
  process.stdout.write('.')
  const rp_vec = blsct.create_range_proof_vec()
  {
    const vs = blsct.create_uint64_vec()
    blsct.add_to_uint64_vec(vs, 123)
    blsct.add_to_uint64_vec(vs, 234)
    blsct.add_to_uint64_vec(vs, 345)
    blsct.add_to_uint64_vec(vs, 567)
    const msg = 'navcoin'
    let nonce = blsct.gen_random_point()
    let token_id = blsct.gen_default_token_id()
    let build_rv = blsct.build_range_proof(
      vs,
      nonce,
      msg,
      token_id
    )
    blsct.add_range_proof_to_vec(rp_vec, build_rv.value)
    blsct.free_obj(build_rv) // range proof object has to be freed after it is added to vector
    blsct.free_obj(nonce)
    blsct.free_obj(token_id)
    blsct.dispose_uint64_vec(vs)
  }
  {
    const vs = blsct.create_uint64_vec()
    blsct.add_to_uint64_vec(vs, 456)
    const nonce = blsct.gen_random_point()
    const msg = 'navio'
    const token_id = blsct.gen_default_token_id()
    const build_rv = blsct.build_range_proof(
      vs,
      nonce,
      msg,
      token_id
    )
    blsct.add_range_proof_to_vec(rp_vec, build_rv.value)
    blsct.free_obj(token_id)
    blsct.dispose_uint64_vec(vs)

    // recover amount
    const reqs = blsct.create_amount_recovery_req_vec()
    const req = blsct.gen_recover_amount_req(
      build_rv.value,
      nonce
    )
    blsct.add_to_amount_recovery_req_vec(reqs, req)
    const res = blsct.recover_amount(reqs)

    const res_size = blsct.get_amount_recovery_result_size(res.value)
    console.log(`recovery res size = ${res_size}`)
    for(let i=0; i<res_size; ++i) {
      const msg = blsct.get_amount_recovery_result_msg(res.value, i)
      const amount = blsct.get_amount_recovery_result_amount(res.value, i)
      console.log(`recovery res[${i}] -> ${msg}:${amount}`)
    }
    blsct.free_amounts_ret_val(res)
    blsct.free_obj(build_rv)
    blsct.free_obj(nonce)
  }

  const veri_rv = blsct.verify_range_proofs(rp_vec)
  if (!veri_rv.value) {
    console.log(`FAILED!!! in the ${i+1}-th try`)
    process.exit(1)
  }
  blsct.dispose_range_proof_vec(rp_vec)
}

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
