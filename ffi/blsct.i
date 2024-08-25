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

  // trying to free the returned value results in error
  // swig seems to be taking care of freeing the allocated memory
  const char* to_hex(uint8_t* buf, size_t buf_size) {
    char* s = static_cast<char*>(malloc(2 * buf_size + 1));
    char* p = s;
    for (size_t i = 0; i<buf_size; ++i) {
        sprintf(p, "%02x", buf[i]);
        p += 2;
    }
    *p = '\0';

    return s;
  } 

  const char* as_string(void* str_buf) {
    return static_cast<const char*>(str_buf);
  }

  // uint64_vec
  void* create_uint64_vec() {
    auto vec = new(std::nothrow) std::vector<uint64_t>;
    HANDLE_MEM_ALLOC_FAILURE(vec);
    return static_cast<void*>(vec);
  }

  void free_uint64_vec(void* vp_vec) {
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

  void free_range_proof_vec(const void* vp_range_proofs) {
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

  void free_tx_in_vec(const void* vp_tx_ins) {
    auto tx_ins = static_cast<const std::vector<BlsctTxIn>*>(vp_tx_ins);
    delete tx_ins; 
  }

  // tx_out_vec
  void* create_tx_out_vec() {
    auto vec = new(std::nothrow) std::vector<BlsctTxOut>;
    HANDLE_MEM_ALLOC_FAILURE(vec);
    return static_cast<void*>(vec);
  }

  void add_tx_out_to_vec(
    void* vp_tx_outs,
    void* vp_tx_out
  ) {
    RETURN_IF_NULL(vp_tx_outs);
    RETURN_IF_NULL(vp_tx_out);

    auto tx_outs = static_cast<std::vector<BlsctTxOut>*>(vp_tx_outs);
    auto tx_out = static_cast<BlsctTxOut*>(vp_tx_out);

    tx_outs->push_back(*tx_out);
  }

  void free_tx_out_vec(const void* vp_tx_outs) {
    auto tx_outs = static_cast<const std::vector<BlsctTxOut>*>(vp_tx_outs);
    delete tx_outs; 
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

  void free_amount_recovery_req_vec(void* vp_amt_recovery_req_vec) {
    RETURN_IF_NULL(vp_amt_recovery_req_vec);
    auto vec = static_cast<const std::vector<BlsctAmountRecoveryReq>*>(vp_amt_recovery_req_vec);
    delete vec;
  }

  // functions to retrieve attrs of amount recovery result 
  size_t get_amount_recovery_result_size(
    void* vp_amt_recovery_req_vec
  ) {
    if (vp_amt_recovery_req_vec == nullptr) {
    }
    auto vec = static_cast<std::vector<BlsctAmountRecoveryResult>*>(vp_amt_recovery_req_vec);
    
    return vec->size();
  }

  bool get_amount_recovery_result_is_succ(
    void* vp_amt_recovery_req_vec,
    size_t idx
  ) {
    RETURN_RET_VAL_IF_NULL(vp_amt_recovery_req_vec, 0);

    auto vec = static_cast<std::vector<BlsctAmountRecoveryResult>*>(vp_amt_recovery_req_vec);
    
    return vec->at(idx).is_succ;
  }

  uint64_t get_amount_recovery_result_amount(
    void* vp_amt_recovery_req_vec,
    size_t idx
  ) {
    RETURN_RET_VAL_IF_NULL(vp_amt_recovery_req_vec, 0);

    auto vec = static_cast<std::vector<BlsctAmountRecoveryResult>*>(vp_amt_recovery_req_vec);
    
    return vec->at(idx).amount;
  }

  const char* get_amount_recovery_result_msg(
    void* vp_amt_recovery_req_vec,
    size_t idx
  ) {
    RETURN_RET_VAL_IF_NULL(vp_amt_recovery_req_vec, nullptr);

    auto vec = static_cast<std::vector<BlsctAmountRecoveryResult>*>(vp_amt_recovery_req_vec);
    
    return vec->at(idx).msg;
  }

  uint8_t* hexToMallocedBuf(const char* hex) {
    size_t buf_len = std::strlen(hex) / 2;
    uint8_t* buf = static_cast<uint8_t*>(malloc(buf_len));

    const char* p = hex;

    for (size_t i=0; i<buf_len; ++i) {
      sscanf(p, "%2hhx", &buf[i]);
      p += 2;
    }
    return buf;
  }

  void** deserializeTxIns(uint8_t* ser_tx, size_t ser_tx_size) {
    
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

export enum TxOutputType {
    Normal,
    StakedCommitment
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

typedef struct {
  BLSCT_RESULT result;
  uint8_t* ser_tx;
  size_t ser_tx_size;
  size_t in_amount_err_index;
  size_t out_amount_err_index;
} BlsctTxRetVal;

export void init();
export bool set_chain(enum Chain chain);

// freeing allocated memory
export void free_obj(void* rv);
export void free_amounts_ret_val(BlsctAmountsRetVal* rv);

// scalar, point, public key, double public key
export BlsctScalar* gen_scalar(const uint64_t n);
export BlsctScalar* gen_random_scalar();

export BlsctPoint* gen_random_point();

export uint64_t scalar_to_uint64(BlsctScalar* blsct_scalar);

export BlsctPubKey* gen_random_public_key();

export BlsctRetVal* gen_double_pub_key(
  const BlsctPubKey* pk1,
  const BlsctPubKey* pk2
);

// address
export BlsctRetVal* decode_address(
  const char* blsct_enc_addr
);

export BlsctRetVal* encode_address(
  const void* blsct_dpk,
  const enum AddressEncoding encoding
);

// token id
export BlsctTokenId* gen_token_id_with_subid(
  const uint64_t token,
  const uint64_t subid
);

export BlsctTokenId* gen_token_id(
  const uint64_t token
);

export BlsctTokenId* gen_default_token_id();

// range proof related
export BlsctRetVal* build_range_proof(
  const void* vp_int_vec,
  const BlsctPoint* blsct_nonce,
  const char* blsct_message,
  const BlsctTokenId* blsct_token_id
);

export BlsctBoolRetVal* verify_range_proofs(
  const void* vp_range_proofs
);

export BlsctAmountRecoveryReq* gen_recover_amount_req(
    const void* vp_blsct_range_proof,
    const void* vp_blsct_nonce
);

export BlsctAmountsRetVal* recover_amount(
    void* vp_amt_recovery_req_vec
);

// tx related
export BlsctOutPoint* gen_out_point(
    const char* tx_id_c_str,
    const uint32_t n
);

export BlsctTxIn* build_tx_in(
    const uint64_t amount,
    const uint64_t gamma,
    const BlsctScalar* spendingKey,
    const BlsctTokenId* tokenId,
    const BlsctOutPoint* outPoint,
    const bool rbf
);

export BlsctSubAddr* dpk_to_sub_addr(
    const void* blsct_dpk
);

export BlsctRetVal* build_tx_out(
    const BlsctSubAddr* blsct_dest,
    const uint64_t amount,
    const char* in_memo_c_str,
    const BlsctTokenId* blsct_token_id,
    const TxOutputType output_type,
    const uint64_t min_stake
);

export BlsctTxRetVal* build_tx(
    const void* void_tx_ins,
    const void* void_tx_outs
);

export CMutableTransaction* deserialize_tx(
    const uint8_t* ser_tx,
    const size_t ser_tx_size
);

export const std::vector<CTxIn>* get_tx_ins(const CMutableTransaction* tx);

export const size_t get_tx_ins_size(const std::vector<CTxIn>* tx_ins);

export const CTxIn* get_tx_in(const std::vector<CTxIn>* tx_ins, const size_t i);

export const std::vector<CTxOut>* get_tx_outs(const CMutableTransaction* tx);

export const size_t get_tx_outs_size(const std::vector<CTxOut>* tx_ins);

export const CTxOut* get_tx_out(const std::vector<CTxOut>* tx_ins, const size_t i);

