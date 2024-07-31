const blsct = require('../build/Release/blsct') as any

blsct.init()

class DisposableObj {
  protected obj: any = null

  get(): any {
    return this.obj
  }

  dispose(): void {
    if (this.obj !== null) {
      blsct.free_obj(this.obj)
    }
  }
}

export class Scalar extends DisposableObj {
  constructor(n: number) {
    super()
    this.obj = blsct.gen_scalar(n)
  }

  toNumber(): number {
    return blsct.scalar_to_uint64(this.obj)
  }
  
}

export class Point extends DisposableObj {
  constructor() {
    super()
    this.obj = blsct.gen_random_point()
  }
}

export class PublicKey extends DisposableObj {
  constructor() {
    super()
    this.obj = blsct.gen_random_public_key()
  }
}

export class TokenId extends DisposableObj {
  constructor(
    token: number | undefined = undefined,
    subid: number | undefined = undefined
  ) {
    super()

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
}

export class DoublePublicKey extends DisposableObj {
  private constructor() {
    super();
  }

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
      throw new Error(`Failed to generate a double public key: ${rv.result}`)
    }
    const dpk = new DoublePublicKey()
    dpk.obj = rv.value
    blsct.free_obj(rv)
    return dpk
  }
}

export class AddressUtil {
  static decode(
    encodedAddr: string,
  ): DoublePublicKey {
    const rv = blsct.decode_address(encodedAddr) 
    if (rv.result !== 0) {
      throw new Error(`Failed to decode address: ${rv.result}`)
    }
    const dpk = DoublePublicKey.fromBlsctDoublePublicKey(rv.value)

    // rv.value (blsct_dpk) is not disposed since it moves to dpk
    blsct.free_obj(rv)

    return dpk 
  }

  static encode(
    dpk: DoublePublicKey,
    encoding: AddressEncoding = 'Bech32M',
    gcAdder: ((x: any) => void) | undefined = undefined
  ): string {
    const rv = blsct.encode_address(
      dpk.get(),
      encoding === 'Bech32' ? blsct.Bech32 : blsct.Bech32M
    )
    if (rv.result !== 0) {
      throw new Error(`Encoding address failed: ${rv.result}`)
    }
    if (gcAdder !== undefined) gcAdder({ get: () => rv.value })

    const enc_addr = blsct.as_string(rv.value)
    blsct.free_obj(rv)

    return enc_addr
  }
}

export type AddressEncoding = 'Bech32' | 'Bech32M'

export class Computation {
  private gc: any[] = []

  private add2GC= (x: DisposableObj): void => {
    this.gc.push(x.get())  
  }

  getScalar = (n: number): any => {
    const x = new Scalar(n)
    this.add2GC(x)
    return x
  }

  getPoint = (): any => {
    const x = new Point()
    this.add2GC(x)
    return x
  }

  getPublicKey = (): any => {
    const x = new PublicKey()
    this.add2GC(x)
    return x
  }

  getTokenId = (
    token: number | undefined = undefined,
    subid: number | undefined = undefined
  ): any => {
    const x = new TokenId(token, subid)
    this.add2GC(x)
    return x
  }

  getDoublcPublicKeyfromPubKeys = (
    pk1: PublicKey,
    pk2: PublicKey
  ): DoublePublicKey => {
    const x = DoublePublicKey.fromTwoPublicKeys(pk1, pk2)
    this.add2GC(x)
    return x
  }

  getDoublcPublicKeyFromBlsctDPK = (
    blsct_dpk: any
  ): DoublePublicKey => {
    const x = DoublePublicKey.fromBlsctDoublePublicKey(blsct_dpk)
    this.add2GC(x)
    return x
  }

  decodeAddress = (
    encodedAddr: string,
  ): DoublePublicKey => {
    const x = AddressUtil.decode(encodedAddr)
    this.add2GC(x)
    return x 
  }

  encodeAddress = (
    dpk: DoublePublicKey,
    encoding: AddressEncoding = 'Bech32M',
  ): string => {
    const encodedAddr = AddressUtil.encode(
      dpk, encoding, this.add2GC
    )
    return encodedAddr
  }

  cleanUp = () => {
    for(let x of this.gc) {
      blsct.free_obj(x)
    }
    this.gc = []
  }
}

