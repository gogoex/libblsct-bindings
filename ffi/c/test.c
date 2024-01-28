#include <stdio.h>
#include <string.h>
#include <blsct.h>

int main() {
    if (!blsct_init(MainNet)) {
        printf("failed to initialize blsct\n");
        return 1;
    }
    printf("initilized blsct\n");

    /* bech32_mod-encoded */
    const char* enc_addr = "nv1jlca8fe3jltegf54vwxyl2dvplpk3rz0ja6tjpdpfcar79cm43vxc40g8luh5xh0lva0qzkmytrthftje04fqnt8g6yq3j8t2z552ryhy8dnpyfgqyj58ypdptp43f32u28htwu0r37y9su6332jn0c0fcvan8l53m";

    unsigned char ser_dpk[ENCODED_DPK_SIZE];

    int decode_result = blsct_decode_address(
        enc_addr,
        ser_dpk
    );
    printf("decode result: %d\n", decode_result);

    char recovered_enc_addr[ENCODED_DPK_SIZE + 1];

    int encode_result = blsct_encode_address(
        ser_dpk,
        recovered_enc_addr,
        Bech32M
    );
    printf("encode result: %d\n", encode_result);

    int cmp_result = strcmp(enc_addr, recovered_enc_addr) == 0;
    printf("original: %s\n", enc_addr);
    printf("recovered: %s\n", recovered_enc_addr);
    printf("are identical: %d\n", cmp_result);

    return 0;
}

