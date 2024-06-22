%module blsct

%{
#include "../../navcoin/src/blsct/external_api/blsct.h"
%}

%include "stdint.i"

extern enum Chain {
  MainNet,
  TestNet
};

export void blsct_init();
export BlsctScalar* blsct_gen_scalar(const uint64_t n);
export uint64_t blsct_scalar_to_uint64(BlsctScalar* blsct_scalar);
export void blsct_delete_scalar(BlsctScalar* blsct_scalar);
