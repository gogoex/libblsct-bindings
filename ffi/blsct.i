%module libblsct

%{
#include "../../navcoin/src/blsct/external_api/blsct.h"
%}

%include "stdint.i"

%typemap(jstype) enum AddressEncoding "number"
%typemap(js2enum) enum AddressEncoding {
    $1 = static_cast<enum AddressEncoding>($input);
}

extern bool blsct_decode_address(const char *blsct_addr, uint8_t ser_dpk[ENCODED_DPK_SIZE]);
extern bool blsct_encode_address(const uint8_t ser_dpk[ENCODED_DPK_SIZE], char *blsct_addr, enum AddressEncoding encoding);

