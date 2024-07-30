const blsct = require('../build/Release/blsct') as any

blsct.init()

export class Blsct {

}

export class Scalar {
  private obj: any

  constructor(n: number) {
    this.obj = blsct.gen_scalar(n)
  }

  toNumber(): number {
    return blsct.scalar_to_uint64(this.obj)
  }

  dispose() {
    blsct.dispose_scalar(this.obj)
  }
}

export class Point {
  private obj: any

  constructor() {
    this.obj = blsct.gen_random_point()
  }

  dispose() {
    blsct.dispose_point(this.obj)
  }
}

export class PublicKey {
  private obj: any

  constructor() {
    this.obj = blsct.gen_random_public_key()
  }

  get(): any { return this.obj }

  dispose() {
    blsct.dispose_public_key(this.obj)

  }
}

export class DoublePublicKey {
  private obj: any

  private constructor() { this.obj = null }

  // this function moves the passed blsct_dpk to this instance
  // therefore the passed dpk should not be disposed
  static fromBlsctDoublePublicKey(blsct_dpk: any): DoublePublicKey {
    const dpk = new DoublePublicKey()
    dpk.obj = blsct_dpk
    return dpk
  }

  static fromTwoPublicKeys(
    pk1: PublicKey,
    pk2: PublicKey
  ): DoublePublicKey {
    const rv = blsct.gen_double_pub_key(
      pk1.get(), pk2.get()
    )
    if (rv.result !== 0) {
      throw new Error('Failed to generate a double public key: ', rv.result)
    }
    console.log(`result`, rv.value)
    const dpk = new DoublePublicKey()
    dpk.obj = rv.value
    blsct.dispose_ret_val(rv)
    return dpk
  }

  get(): any { return this.obj }

  dispose() {
    if (this.obj !== null) {
      blsct.dispose_double_pub_key(this.obj)
    }
  }
}

export type AddressEncoding = 'Bech32' | 'Bech32M'

export class AddressUtil {
  static decode(
    encodedAddr: string,
  ): DoublePublicKey {

    const rv = blsct.decode_address(encodedAddr) 
    const dpk = DoublePublicKey.fromBlsctDoublePublicKey(rv.value)

    // rv.value (blsct_dpk) moves to dpk, so is not disposed
    blsct.dispose_ret_val(rv)

    return dpk 
  }

  static encode(
    dpk: DoublePublicKey,
    encoding: AddressEncoding = 'Bech32M',
  ): string {
    const rv = blsct.encode_address(
      dpk.get(),
      encoding === 'Bech32' ? blsct.Bech32 : blsct.Bech32M
    )
    const enc_addr = blsct.as_string(rv.value)
    blsct.dispose_ret_val(rv)
    return enc_addr
  }
}

export class TokenId {
  private obj: any

  constructor(
    token: number | undefined = undefined,
    subid: number | undefined = undefined
  ) {
    if (token === undefined && subid === undefined) {
      this.obj = blsct.gen_default_token_id();
    }
    else if (token !== undefined && subid === undefined) {
      this.obj = blsct.gen_token_id(token);
    }
    else if (token !== undefined && subid !== undefined) {
      this.obj = blsct.gen_token_id_with_subid(token, subid) 
    }
    else {
      throw new Error(`when subid is specified, token needs to be specified`)
    }
  }

  dispose() {
    blsct.dispose_token_id(this.obj)
  }
}
