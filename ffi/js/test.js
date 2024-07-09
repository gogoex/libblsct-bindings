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
  token_id = blsct.gen_token_id(2323)
  token_id = blsct.gen_token_id_with_subid(23, 45) 
}

// range proof
{
  const vs = blsct.create_uint64_t_array(1)
  vs[0] = 123
  const nonce = blsct.gen_random_point()
  const msg = 'navcoin'
  const token_id = blsct.gen_default_token_id()
  const rp = blsct.build_range_proof(
    vs,
    0,
    nonce,
    msg,
    msg.length + 1, // TODO add this on the c side
    token_id
  )
  const rps = blsct.create_range_proof_array(1)
  rps[0] = rp.value
  const is_valid = blsct.verify_range_proofs(rps, 1)
  console.log(`proof is valid? ${is_valid.value}`)
}

console.log('done')
