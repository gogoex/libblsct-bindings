%module blsct

%{
#include "../../navcoin/src/blsct/external_api/blsct.h"
%}

%include "stdint.i"

extern enum Chain {
  MainNet,
  TestNet
};

extern void blsct_init();

