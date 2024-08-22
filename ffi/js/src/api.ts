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

export class RangeProof extends DisposableObj {
  constructor(rangeProof: any) {
    super()
    this.obj = rangeProof
  }
}

export class OutPoint extends DisposableObj {
  constructor(txId: string, outIndex: number) {
    super()
    this.obj = blsct.gen_out_point(txId, outIndex)
  }
}

export class TxIn extends DisposableObj {
  constructor(
    amount: number,
    gamma: number,
    spendingKey: Scalar,
    tokenId: TokenId,
    outPoint: OutPoint,
    rbf: boolean = false,
  ) {
    super()
    this.obj = blsct.build_tx_in(
      amount,
      gamma,
      spendingKey.get(),
      tokenId.get(),
      outPoint.get(),
      rbf,
    )
  }
}

export class SubAddress extends DisposableObj {
  constructor(dpk: DoublePublicKey) {
    super()
    this.obj = blsct.dpk_to_sub_addr(dpk.get())
  }
}

export type TxOutputType = 'Normal' | 'StakedCommitment'

export class TxOut extends DisposableObj {
  constructor(
    subAddr: SubAddress,
    amount: number,
    memo: string,
    tokenId: TokenId | undefined = undefined,
    outputType: TxOutputType = 'Normal',
    minStake: number = 0,
  ) {
    super()
    const paramTokenId = tokenId === undefined ? new TokenId() : tokenId
    const rv = blsct.build_tx_out(
      subAddr.get(),
      amount,
      memo,
      paramTokenId.get(),
      outputType === 'Normal' ? blsct.Normal : blsct.StakedCommitment,
      minStake,
    )
    if (rv.result !== 0) {
      throw new Error(`Building TxOut failed: ${rv.result}`)
    }
    this.obj = rv.value
  }
}

export class Tx extends DisposableObj {
  hex: string

  constructor(
    txIns: TxIn[],
    txOuts: TxOut[],
  ) {
    super()

    const txInVec = blsct.create_tx_in_vec()
    for(const txIn of txIns) {
      blsct.add_tx_in_to_vec(txInVec, txIn.get())
    }

    const txOutVec = blsct.create_tx_out_vec()
    for(const txOut of txOuts) {
      blsct.add_tx_out_to_vec(txOutVec, txOut.get())
    }

    const rv = blsct.build_tx(txInVec, txOutVec)

    if (rv.result !== 0) {
      throw new Error(`Building Tx failed: ${rv.result}`)
    }

    this.obj = rv.ser_tx
    this.hex = blsct.to_hex(rv.ser_tx, rv.ser_tx_size)
  }

  toString = (): string => this.hex
}

// not responsible for feeing given parameters
export class AmtRecoveryReq {
  rangeProof: RangeProof
  nonce: Point

  constructor(
    rangeProof: RangeProof,
    nonce: Point,
  ) {
    this.rangeProof = rangeProof
    this.nonce = nonce
  }
}

export class AmtRecoveryRes {
  is_succ: boolean
  message: string
  amount: number

  constructor(
    is_succ: boolean,
    amount: number,
    message: string,
  ) {
    this.is_succ = is_succ
    this.amount = amount
    this.message = message
  }
  
  toString = (): string => `${this.is_succ}:${this.amount}:${this.message}`
}

export type AddressEncoding = 'Bech32' | 'Bech32M'

export class Computation {
  private gc: any[] = []

  private add2GC= (x: DisposableObj): void => {
    this.gc.push(x.get())  
  }

  Scalar = (n: number): any => {
    const x = new Scalar(n)
    this.add2GC(x)
    return x
  }

  Point = (): any => {
    const x = new Point()
    this.add2GC(x)
    return x
  }

  PublicKey = (): any => {
    const x = new PublicKey()
    this.add2GC(x)
    return x
  }

  TokenId = (
    token: number | undefined = undefined,
    subid: number | undefined = undefined
  ): any => {
    const x = new TokenId(token, subid)
    this.add2GC(x)
    return x
  }

  DoublcPublicKeyfromPubKeys = (
    pk1: PublicKey,
    pk2: PublicKey
  ): DoublePublicKey => {
    const x = DoublePublicKey.fromTwoPublicKeys(pk1, pk2)
    this.add2GC(x)
    return x
  }

  DoublcPublicKeyFromBlsctDPK = (
    blsct_dpk: any
  ): DoublePublicKey => {
    const x = DoublePublicKey.fromBlsctDoublePublicKey(blsct_dpk)
    this.add2GC(x)
    return x
  }

  OutPoint = (
    txId: string,
    outIndex: number,
  ): OutPoint => {
    const x = new OutPoint(txId, outIndex)
    this.add2GC(x)
    return x
  }

  TxIn = (
    amount: number,
    gamma: number,
    spendingKey: Scalar,
    tokenId: TokenId,
    outPoint: OutPoint,
    rbf: boolean = false,
  ): TxIn => {
    const x = new TxIn(
      amount,
      gamma,
      spendingKey,
      tokenId,
      outPoint,
      rbf
    )
    this.add2GC(x)
    return x
  }

  TxOut = (
    subAddr: SubAddress,
    amount: number,
    memo: string,
    tokenId: TokenId | undefined = undefined,
    outputType: TxOutputType = 'Normal',
    minStake: number = 0,
  ): TxOut => {
    const x = new TxOut(
      subAddr,
      amount,
      memo,
      tokenId,
      outputType,
      minStake,
    )
    this.add2GC(x)
    return x
  }

  Tx = (
    txIns: TxIn[],
    txOuts: TxOut[],
  ): Tx => {
    const x = new Tx(
      txIns,
      txOuts,
    )
    this.add2GC(x)
    return x
  }

  SubAddress = (dpk: DoublePublicKey) => {
    const x = new SubAddress(dpk)
    this.add2GC(x)
    return x
  }

  runGC = () => {
    for(let x of this.gc) {
      blsct.free_obj(x)
    }
    this.gc = []
  }

  ///

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

  buildRangeProof = (
    vs: number[],
    nonce: Point,
    message: string,
    tokenId: TokenId | undefined = undefined,
  ): RangeProof => {
    const vsVec = blsct.create_uint64_vec()
    for(let v of vs) {
      blsct.add_to_uint64_vec(vsVec, v)
    }

    let paramTokenId = tokenId
    if (paramTokenId === undefined) {
      paramTokenId = new TokenId()
    }
    let rv = blsct.build_range_proof(
      vsVec,
      nonce.get(),
      message,
      paramTokenId.get(),
    )

    // if locally generated tokenId was used, free it
    if (tokenId === undefined) {
      blsct.free_obj(paramTokenId.get())
    }
    blsct.free_uint64_vec(vsVec)
    
    if (rv.result !== 0) {
      blsct.free_obj(rv)
      throw new Error(`Building range proof failed: ${rv.result}`)
    }
    const rangeProof = new RangeProof(rv.value)
    blsct.free_obj(rv)
 
    // the builder of range proof is responsible for freeing it
    this.add2GC(rangeProof)

    return rangeProof
  }

  verifyRangeProof = (
    proofs: RangeProof[],
  ): boolean => {
    const vec = blsct.create_range_proof_vec()
    for(const proof of proofs) {
      blsct.add_range_proof_to_vec(vec, proof.get())
    }
    
    const rv = blsct.verify_range_proofs(vec)
    if (rv.result !== 0) {
      blsct.free_obj(rv)
      throw new Error(`Verifying range proofs failed: ${rv.result}`)
    }
    // the verifier of range proofs is not responsible for freeing the proofs
    blsct.free_range_proof_vec(vec)

    const res = rv.value
    blsct.free_obj(rv)
    return res
  }

  recoverAmount = (
    reqs: AmtRecoveryReq[],
  ): AmtRecoveryRes[] => {
    const reqVec = blsct.create_amount_recovery_req_vec()

    for(const req of reqs) {
      const req_ = blsct.gen_recover_amount_req(
        req.rangeProof.get(),
        req.nonce.get(),
      )
      blsct.add_to_amount_recovery_req_vec(reqVec, req_)
    }

    const rv = blsct.recover_amount(reqVec)
    blsct.free_amount_recovery_req_vec(reqVec)

    if (rv.result !== 0) {
      blsct.free_amounts_ret_val(rv)
      throw new Error(`Recovering amount failed: ${rv.result}`)
    }
 
    const res = []
    const size = blsct.get_amount_recovery_result_size(rv.value)

    for(let i=0; i<size; ++i) {
      const is_succ = blsct.get_amount_recovery_result_is_succ(rv.value, i)
      const amount = blsct.get_amount_recovery_result_amount(rv.value, i)
      const message = blsct.get_amount_recovery_result_msg(rv.value, i)
      const x = new AmtRecoveryRes(
        is_succ, 
        amount,
        message,
      )
      res.push(x)
    }
    blsct.free_amounts_ret_val(rv)

    return res
  }

}

