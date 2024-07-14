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

  console.log('recovered enc addr', rv2)
}

// encode address
{
  const pk1 = blsct.gen_random_public_key()
  const pk2 = blsct.gen_random_public_key()
  const dpk = blsct.gen_double_pub_key(pk1, pk2)

  const rv = blsct.encode_address(dpk, blsct.Bech32) 
  console.log('enc addr', rv)
}

// token id
{
  let token_id = blsct.gen_default_token_id();
  blsct.dispose_token_id(token_id)

  token_id = blsct.gen_token_id(2323)
  blsct.dispose_token_id(token_id)

  token_id = blsct.gen_token_id_with_subid(23, 45) 
  blsct.dispose_token_id(token_id)
}

// range proof
{
  const rp_vec = blsct.create_range_proof_vec()
  {
    const vs = blsct.create_uint64_t_vec()
    blsct.add_uint64_t_to_vec(vs, 123)
    blsct.add_uint64_t_to_vec(vs, 234)
    const nonce = blsct.gen_random_point()
    const msg = 'navcoin'
    const token_id = blsct.gen_default_token_id()
    const build_rv = blsct.build_range_proof(
      vs,
      2,
      nonce,
      msg,
      msg.length,
      token_id
    )

    blsct.add_range_proof_to_vec(rp_vec, build_rv.value)
    blsct.dispose_range_proof(build_rv.value)
  }
  {
    const vs = blsct.create_uint64_t_vec()
    blsct.add_uint64_t_to_vec(vs, 456)
    const nonce = blsct.gen_random_point()
    const msg = 'navcoin'
    const token_id = blsct.gen_default_token_id()
    const build_rv = blsct.build_range_proof(
      vs,
      1,
      nonce,
      msg,
      msg.length,
      token_id
    )

    blsct.add_range_proof_to_vec(rp_vec, build_rv.value)
    blsct.dispose_range_proof(build_rv.value)
  }
 
  const veri_rv = blsct.verify_range_proofs(rp_vec)
  console.log(`proof is valid? ${veri_rv.value}`)
}

console.log('done')
