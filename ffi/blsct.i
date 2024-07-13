%module blsct

%{
#include "../../navio-core/src/blsct/external_api/blsct.h"
%}

%inline %{

  void* create_uint64_t_vec() {
    return static_cast<void*>(new std::vector<uint64_t>);
  }

  void dispose_uint64_t_vec(const void* vec) {
  }

  void add_uint64_t_to_vec(
    void* vp_uint64_ts,
    const uint64_t n
  ) {
    auto uint64_ts = static_cast<std::vector<uint64_t>*>(vp_uint64_ts);

    uint64_ts->push_back(n);
  }

  void* create_range_proof_vec() {
    return static_cast<void*>(new std::vector<bulletproofs::RangeProof<Mcl>>);
  }

  void dispose_range_proof_vec(const void* vp_range_proofs) {
    auto range_proofs = static_cast<const std::vector<uint64_t>*>(vp_range_proofs);
    delete range_proofs; 
  }

  void add_range_proof_to_vec(
    void* vp_range_proofs,
    const BlsctRangeProof* blsct_range_proof
  ) {
    auto range_proofs = static_cast<std::vector<bulletproofs::RangeProof<Mcl>>*>(vp_range_proofs);

    // unserialize range proof
    bulletproofs::RangeProof<Mcl> range_proof;

    DataStream st{};
    for(size_t i=0; i<RANGE_PROOF_SIZE; ++i) {
      st << blsct_range_proof[i];
    }
    range_proof.Unserialize(st);

    // and move to the vector
    range_proofs->push_back(std::move(range_proof));
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
  RetValType type;
  BLSCT_RESULT result;
  void* value;
} BlsctRetVal;

typedef struct {
  BLSCT_RESULT result;
  char* value;
} BlsctStrRetVal;

typedef struct {
  BLSCT_RESULT result;
  bool value;
} BlsctBoolRetVal;

typedef struct {
  BLSCT_RESULT result;
  BlsctRangeProof* value;
} BlsctRpRetVal;

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

export BlsctRpRetVal* build_range_proof(
  const void* uint64_vs,
  const size_t num_uint64_vs,
  const BlsctPoint* blsct_nonce,
  const char* blsct_message,
  const size_t blsct_message_size,
  const BlsctTokenId* blsct_token_id
);

export BlsctBoolRetVal* verify_range_proofs(
  const void* vp_range_proofs
);

