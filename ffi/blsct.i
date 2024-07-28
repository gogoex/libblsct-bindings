%module blsct

%{
#include "../../navio-core/src/blsct/external_api/blsct.h"
%}

%inline %{
#define HANDLE_MEM_ALLOC_FAILURE(name) \
if (name == nullptr) { \
  printf("ERROR: Memory allocation failed\n"); \
  return nullptr; \
}

#define RETURN_RET_VAL_IF_NULL(p, ret_val) \
if (p == nullptr) { \
  printf("ERROR: " #p " is null\n"); \
  return ret_val; \
}

#define RETURN_IF_NULL(p) \
if (p == nullptr) { \
  printf("ERROR: " #p " is null\n"); \
  return; \
}

  // uint64_vec
  void* create_uint64_vec() {
    auto vec = new(std::nothrow) std::vector<uint64_t>;
    HANDLE_MEM_ALLOC_FAILURE(vec);
    return static_cast<void*>(vec);
  }

  void dispose_uint64_vec(void* vp_vec) {
    if (vp_vec == nullptr) return;
    auto vec = static_cast<const std::vector<uint64_t>*>(vp_vec);
    delete vec;
  }

  void add_to_uint64_vec(
    void* vp_uint64_vec,
    const uint64_t n
  ) {
    RETURN_IF_NULL(vp_uint64_vec);
    auto uint64_vec = static_cast<std::vector<uint64_t>*>(vp_uint64_vec);

    uint64_vec->push_back(n);
  }

  // range_proof_vec
  void* create_range_proof_vec() {
    auto vec = new(std::nothrow) std::vector<bulletproofs::RangeProof<Mcl>>;
    HANDLE_MEM_ALLOC_FAILURE(vec);
    return static_cast<void*>(vec);
  }

  void add_range_proof_to_vec(
    void* vp_range_proofs,
    void* vp_blsct_range_proof
  ) {
    RETURN_IF_NULL(vp_range_proofs);
    RETURN_IF_NULL(vp_blsct_range_proof);

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

  void dispose_range_proof_vec(const void* vp_range_proofs) {
    if (vp_range_proofs == nullptr) return;
    auto range_proofs = static_cast<const std::vector<bulletproofs::RangeProof<Mcl>>*>(vp_range_proofs);
    delete range_proofs; 
  }

  // tx_in_vec
  void* create_tx_in_vec() {
    auto vec = new(std::nothrow) std::vector<BlsctTxIn>;
    HANDLE_MEM_ALLOC_FAILURE(vec);
    return static_cast<void*>(vec);
  }

  void add_tx_in_to_vec(
    void* vp_tx_ins,
    void* vp_tx_in
  ) {
    RETURN_IF_NULL(vp_tx_ins);
    RETURN_IF_NULL(vp_tx_in);

    auto tx_ins = static_cast<std::vector<BlsctTxIn>*>(vp_tx_ins);
    auto tx_in = static_cast<BlsctTxIn*>(vp_tx_in);

    tx_ins->push_back(*tx_in);
  }

  void dispose_tx_in_vec(const void* vp_tx_ins) {
    auto tx_ins = static_cast<const std::vector<BlsctTxIn>*>(vp_tx_ins);
    delete tx_ins; 
  }

  // amount_recovery_req_vec
  void* create_amount_recovery_req_vec() {
    auto vec = new(std::nothrow) std::vector<BlsctAmountRecoveryReq>;
    RETURN_RET_VAL_IF_NULL(vec, nullptr);
    return static_cast<void*>(vec);
  }

  void add_to_amount_recovery_req_vec(
    void* vp_amt_recovery_req_vec,
    void* vp_amt_recovery_req
  ) {
    RETURN_IF_NULL(vp_amt_recovery_req_vec);
    RETURN_IF_NULL(vp_amt_recovery_req);

    auto vec = static_cast<std::vector<BlsctAmountRecoveryReq>*>(vp_amt_recovery_req_vec);
    auto req = static_cast<BlsctAmountRecoveryReq*>(vp_amt_recovery_req);
    vec->push_back(*req);
  }

  size_t get_amount_recovery_result_size(
    void* vp_amt_recovery_req_vec
  ) {
    if (vp_amt_recovery_req_vec == nullptr) {
    }
    auto vec = static_cast<std::vector<BlsctAmountRecoveryResult>*>(vp_amt_recovery_req_vec);
    
    return vec->size();
  }

  const char* get_amount_recovery_result_msg(
    void* vp_amt_recovery_req_vec,
    size_t idx
  ) {
    RETURN_RET_VAL_IF_NULL(vp_amt_recovery_req_vec, nullptr);

    auto vec = static_cast<std::vector<BlsctAmountRecoveryResult>*>(vp_amt_recovery_req_vec);
    
    return vec->at(idx).msg;
  }

  uint64_t get_amount_recovery_result_amount(
    void* vp_amt_recovery_req_vec,
    size_t idx
  ) {
    RETURN_RET_VAL_IF_NULL(vp_amt_recovery_req_vec, 0);

    auto vec = static_cast<std::vector<BlsctAmountRecoveryResult>*>(vp_amt_recovery_req_vec);
    
    return vec->at(idx).amount;
  }

  void dispose_amount_recovery_req_vec(void* vp_amt_recovery_req_vec) {
    RETURN_IF_NULL(vp_amt_recovery_req_vec);
    auto vec = static_cast<const std::vector<BlsctAmountRecoveryReq>*>(vp_amt_recovery_req_vec);
    delete vec;
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

typedef struct {
  BLSCT_RESULT result;
  void* value;
} BlsctAmountsRetVal;

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

export BlsctOutPoint* gen_out_point(
    const char* tx_id_c_str,
    const uint32_t n
);

export BlsctAmountRecoveryReq* gen_recover_amount_req(
    const void* vp_blsct_range_proof,
    const void* vp_blsct_nonce
);

export BlsctAmountsRetVal* recover_amount(
    void* vp_amt_recovery_req_vec
);

export void dispose_ret_val(BlsctRetVal* rv);
export void dispose_bool_ret_val(BlsctBoolRetVal* rv);
export void dispose_amounts_ret_val(BlsctAmountsRetVal* rv);

export void dispose_scalar(BlsctScalar* x);
export void dispose_point(BlsctPoint* x);
export void dispose_token_id(BlsctTokenId* x);
export void dispose_public_key(BlsctPubKey* x);
export void dispose_double_pub_key(BlsctDoublePubKey* x);
