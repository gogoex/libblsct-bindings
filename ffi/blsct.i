%module blsct

%{
#include "../../navcoin/src/blsct/external_api/blsct.h"
%}

%inline %{
  uint64_t* create_uint64_t_array(size_t n) {
    return new uint64_t[n];
  }

  BlsctRangeProof** create_range_proof_array(size_t n) {
    return new BlsctRangeProof*[n];
  }
%}

%include "stdint.i"

#define BLSCT_RESULT uint8_t

extern enum Chain {
  MainNet,
  TestNet
};

export enum AddressEncoding {
    Bech32,
    Bech32M
};

typedef struct {
  void* value;
  BLSCT_RESULT result;
} BlsctRetVal;

typedef struct {
  char* value;
  BLSCT_RESULT result;
} BlsctStrRetVal;

typedef struct {
  bool value;
  BLSCT_RESULT result;
} BlsctBoolRetVal;

export void init();
export bool set_chain(enum Chain chain);

export BlsctScalar* gen_scalar(const uint64_t n);
export BlsctScalar* gen_random_scalar();

export BlsctPoint* gen_random_point();

export uint64_t scalar_to_uint64(BlsctScalar* blsct_scalar);

export void dispose_scalar(BlsctScalar* blsct_scalar);
export void dispose_point(BlsctPoint* blsct_point);

export BlsctPubKey* gen_random_public_key();
export void dispose_public_key(BlsctPubKey* blsct_pub_key);

export BlsctDoublePubKey* gen_double_pub_key(
  const BlsctPubKey* pk1,
  const BlsctPubKey* pk2
);

export void dispose_double_pub_key(const BlsctDoublePubKey* blsct_dpk);

export BlsctRetVal* decode_address(
  const char* blsct_enc_addr
);

export BlsctStrRetVal* encode_address(
  const void* blsct_dpk,
  const enum AddressEncoding encoding
);

export BlsctTokenId* gen_token_id_with_subid(
  const uint64_t token,
  const uint64_t subid
);

export BlsctTokenId* gen_token_id(
  const uint64_t token
);

export BlsctTokenId* gen_default_token_id();

export BlsctRetVal* build_range_proof(
  uint64_t* uint64_vs,
  const size_t num_uint64_vs,
  BlsctPoint* blsct_nonce,
  const char* blsct_message,
  const size_t blsct_message_size,
  BlsctTokenId* blsct_token_id
);

export BlsctRetVal* verify_range_proofs(
  const BlsctRangeProof** blsct_range_proofs,
  const size_t num_range_proofs
);

