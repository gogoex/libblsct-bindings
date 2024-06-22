%module blsct

%{
#include "../../navcoin/src/blsct/external_api/blsct.h"
%}

%include "stdint.i"
%include "carrays.i"
%array_class(uint8_t, Uint8Array);

%typemap(jstype) uint8_t *BlsctPoint "Uint8Array"
%typemap(js2c) uint8_t *BlsctPoint {
  $1 = (uint8_t *) malloc(POINT_SIZE * sizeof(uint8_t));
  for (int i = 0; i < POINT_SIZE; i++) {
    $1[i] = $input[i];
  }
}

%typemap(freearg) uint8_t *BlsctPoint {
  free($1);
}

extern enum Chain {
  MainNet,
  TestNet
};

%constant size_t POINT_SIZE;

export void blsct_init();
export void blsct_gen_random_point(BlsctPoint*);
