const api = require('./dist/api')
const {
  AddressUtil,
  DoublePublicKey,
  Point,
  PublicKey,
  Scalar,
  TokenId,
} = api
const blsct = require('./build/Release/blsct')

blsct.init()

// scalar
const scalar = new Scalar(1234)
console.log(scalar.toNumber())
scalar.dispose()

// point
const point = new Point()
point.dispose()

// pubkey, dpk
const pk1 = new PublicKey()
const pk2 = new PublicKey()
const dpk = DoublePublicKey.fromTwoPublicKeys(pk1, pk2)

pk1.dispose()
pk2.dispose()
dpk.dispose()

// decode address
{
  const enc_addr1 = "nv1jlca8fe3jltegf54vwxyl2dvplpk3rz0ja6tjpdpfcar79cm43vxc40g8luh5xh0lva0qzkmytrthftje04fqnt8g6yq3j8t2z552ryhy8dnpyfgqyj58ypdptp43f32u28htwu0r37y9su6332jn0c0fcvan8l53m"
  const dpk = AddressUtil.decode(enc_addr1)

  const enc_addr2 = AddressUtil.encode(dpk)
  dpk.dispose()
  console.log(`recovered enc addr ${enc_addr2}`)
}

// encode address
{
  const pk1 = new PublicKey()
  const pk2 = new PublicKey()
  const dpk = DoublePublicKey.fromTwoPublicKeys(pk1, pk2)

  const enc_addr = AddressUtil.encode(dpk)
  console.log(`recovered enc addr: ${enc_addr}`)

  pk1.dispose()
  pk2.dispose()
  dpk.dispose()
}

// token id
{
  {
    const token_id = new TokenId()
    token_id.dispose()
  }
  {
    const token_id = new TokenId(2323)
    token_id.dispose()
  }
  {
    const token_id = new TokenId(23, 45)
    token_id.dispose()
  }
}

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
    blsct.dispose_ret_val(build_rv) // range proof object has to be freed after it is added to vector
    blsct.dispose_point(nonce)
    blsct.dispose_token_id(token_id)
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
    blsct.dispose_token_id(token_id)
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
    blsct.dispose_amounts_ret_val(res)

    blsct.dispose_ret_val(build_rv)
    blsct.dispose_point(nonce)
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
