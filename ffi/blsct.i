%module libblsct

%{
#include "../../include/blsct.h"
%}

%include "stdint.i"

extern bool blsct_init(enum Chain chain);
extern bool blsct_decode_address(const char *blsct_addr, uint8_t ser_dpk[ENCODED_DPK_SIZE]);
extern bool blsct_encode_address(const uint8_t ser_dpk[ENCODED_DPK_SIZE], char *blsct_addr, enum AddressEncoding encoding);

