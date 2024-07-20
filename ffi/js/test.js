const blsct = require('./build/Release/blsct')

blsct.init()

// scalar
const scalar = blsct.gen_scalar(1234)
const n = blsct.scalar_to_uint64(scalar)
blsct.dispose_scalar(scalar)
console.log(n)

// point
const point = blsct.gen_random_point()
blsct.dispose_point(point)

// pubkey, dpk
const pk1 = blsct.gen_random_public_key()
const pk2 = blsct.gen_random_public_key()
const dpk = blsct.gen_double_pub_key(pk1, pk2)

blsct.dispose_double_pub_key(dpk)
blsct.dispose_public_key(pk1)
blsct.dispose_public_key(pk2)

// decode address
{
  const enc_addr = "nv1jlca8fe3jltegf54vwxyl2dvplpk3rz0ja6tjpdpfcar79cm43vxc40g8luh5xh0lva0qzkmytrthftje04fqnt8g6yq3j8t2z552ryhy8dnpyfgqyj58ypdptp43f32u28htwu0r37y9su6332jn0c0fcvan8l53m"
  const rv_dec = blsct.decode_address(enc_addr)
  const dpk = rv_dec.value
  const rv2 = blsct.encode_address(dpk, blsct.Bech32) 

  console.log('recovered enc addr', rv2.value)
  blsct.dispose_ret_val(rv2)
}

// encode address
{
  const pk1 = blsct.gen_random_public_key()
  const pk2 = blsct.gen_random_public_key()
  const dpk = blsct.gen_double_pub_key(pk1, pk2)

  const rv = blsct.encode_address(dpk, blsct.Bech32) 
  console.log('recovered enc addr', rv.value)
  blsct.dispose_ret_val(rv)

blsct.dispose_double_pub_key(dpk)
blsct.dispose_public_key(pk1)
blsct.dispose_public_key(pk2)
}

// token id
{
  {
    const token_id = blsct.gen_default_token_id();
    blsct.dispose_token_id(token_id)
  }
  {
    const token_id = blsct.gen_token_id(2323)
    blsct.dispose_token_id(token_id)
  }
  {
    const token_id = blsct.gen_token_id_with_subid(23, 45) 
    blsct.dispose_token_id(token_id)
  }
}

// range proof
for(let i=0; i<1000; ++i) {
  {
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
      blsct.dispose_ret_val(build_rv) // range proof object has to be freed after copied to vector
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
      blsct.dispose_ret_val(build_rv)
      blsct.dispose_point(nonce)
      blsct.dispose_token_id(token_id)
      blsct.dispose_uint64_vec(vs)
    }

    const veri_rv = blsct.verify_range_proofs(rp_vec)
    if (!veri_rv.value) {
      console.log(`FAILED!!! in the ${i+1}-th try`)
      process.exit(1)
    }
    blsct.dispose_range_proof_vec(rp_vec)
  }
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
