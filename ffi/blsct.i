%module blsct

%{
#include "../../navio-core/src/blsct/external_api/blsct.h"
%}

%inline %{
  void* create_uint64_vec() {
    auto vec = new std::vector<uint64_t>;
    return static_cast<void*>(vec);
  }

  void dispose_uint64_vec(void* vp_vec) {
    auto vec = static_cast<const std::vector<uint64_t>*>(vp_vec);
    delete vec;
  }

  void add_to_uint64_vec(
    void* vp_uint64_vec,
    const uint64_t n
  ) {
    auto uint64_vec = static_cast<std::vector<uint64_t>*>(vp_uint64_vec);

    uint64_vec->push_back(n);
  }

  void* create_range_proof_vec() {
    return static_cast<void*>(new std::vector<bulletproofs::RangeProof<Mcl>>);
  }

  void dispose_range_proof_vec(const void* vp_range_proofs) {
    auto range_proofs = static_cast<const std::vector<bulletproofs::RangeProof<Mcl>>*>(vp_range_proofs);
    delete range_proofs; 
  }

  void add_range_proof_to_vec(
    void* vp_range_proofs,
    void* vp_blsct_range_proof
  ) {
    auto range_proofs = static_cast<std::vector<bulletproofs::RangeProof<Mcl>>*>(vp_range_proofs);
    auto blsct_range_proof = static_cast<BlsctRangeProof*>(vp_blsct_range_proof);

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
  BLSCT_RESULT result;
  void* value;
} BlsctRetVal;

typedef struct {
  BLSCT_RESULT result;
  bool value;
} BlsctBoolRetVal;

export void init();
export bool set_chain(enum Chain chain);

export BlsctScalar* gen_scalar(const uint64_t n);
export BlsctScalar* gen_random_scalar();

export BlsctPoint* gen_random_point();

export uint64_t scalar_to_uint64(BlsctScalar* blsct_scalar);

export BlsctPubKey* gen_random_public_key();

export BlsctDoublePubKey* gen_double_pub_key(
  const BlsctPubKey* pk1,
  const BlsctPubKey* pk2
);

export BlsctRetVal* decode_address(
  const char* blsct_enc_addr
);

export BlsctRetVal* encode_address(
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
  const void* vp_int_vec,
  const BlsctPoint* blsct_nonce,
  const char* blsct_message,
  const BlsctTokenId* blsct_token_id
);

export BlsctBoolRetVal* verify_range_proofs(
  const void* vp_range_proofs
);

export BlsctOutPoint* blsct_gen_out_point(
    const char* tx_id_c_str,
    const uint32_t n
);

export void dispose_ret_val(BlsctRetVal* rv);
export void dispose_bool_ret_val(BlsctBoolRetVal* rv);
export void dispose_scalar(BlsctScalar* x);
export void dispose_point(BlsctPoint* x);
export void dispose_token_id(BlsctTokenId* x);
export void dispose_public_key(BlsctPubKey* x);
export void dispose_double_pub_key(BlsctDoublePubKey* x);
