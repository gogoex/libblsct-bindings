const blsct = require('../build/Release/blsct') as any

blsct.init()

abstract class DisposableObj<T extends DisposableObj<any>> {
  protected obj: any
  protected objSize: number

  constructor(obj: any, objSize: number) {
    this.obj = obj
    this.objSize = objSize
  }

  abstract get: () => any

  getSize = (): number => this.objSize

  dispose = (): void => blsct.free_obj(this.obj)

  serialize = (): string => blsct.to_hex(this.get(), this.objSize)

  deserialize = (hex: string): T => {
    const serObj = blsct.hexToMallocedBuf(hex)
    const serObjSize = hex.length / 2
    return new (this.constructor as any)(serObj, serObjSize) as T 
  }

  toString = (): string => this.serialize()
}

export class Scalar extends DisposableObj<Scalar> {
  constructor(n: number) {
    const rv = blsct.gen_scalar(n)
    const scalar = blsct.cast_to_scalar(rv.value)
    super(scalar, rv.value_size)
    blsct.free_obj(rv)
  }

  get = (): any => {
    return blsct.cast_to_scalar(this.obj)
  }

  toNumber(): number {
    return blsct.scalar_to_uint64(this.get())
  }
}

export class Point extends DisposableObj<Point> {
  constructor() {
    const rv = blsct.gen_random_point()
    super(rv.value, rv.value_size)
    blsct.free_obj(rv)
  }

  get = (): any => {
    return blsct.cast_to_point(this.obj)
  }
}

export class PublicKey extends DisposableObj<PublicKey> {
  constructor() {
    const rv = blsct.gen_random_public_key()
    const pubKey = blsct.cast_to_pub_key(rv.value)
    super(pubKey, rv.value_size)
    blsct.free_obj(rv)
  }

  get = (): any => {
    return blsct.cast_to_pub_key(this.obj)
  }
}

export class TokenId extends DisposableObj<TokenId> {
  constructor(
    token: number | undefined = undefined,
    subid: number | undefined = undefined,
  ) {
    let rv
    if (token === undefined && subid === undefined) {
      rv = blsct.gen_default_token_id();
    }
    else if (token !== undefined && subid === undefined) {
      rv = blsct.gen_token_id(token);
    }
    else if (token !== undefined && subid !== undefined) {
      rv = blsct.gen_token_id_with_subid(token, subid) 
    }
    else {
      throw new Error(`when subid is specified, token needs to be specified`)
    }
    super(rv.value, rv.value_size)
    blsct.free_obj(rv)
  }

  get = (): any => {
    return blsct.cast_to_token_id(this.obj)
  }
}

export class DoublePublicKey extends DisposableObj<DoublePublicKey> {
  private constructor(dpk: any, dpkSize: number) {
    const typedDpk = blsct.cast_to_dpk(dpk)
    super(typedDpk, dpkSize);
  }

  // the ownership of `blsct_dpk` moves to this instance from the caller
  static moveBlsctDoublePublicKey(dpk: any, dpkSize: number): DoublePublicKey {
    return new DoublePublicKey(dpk, dpkSize)
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
    const dpk = new DoublePublicKey(rv.value, rv.value_size)
    blsct.free_obj(rv)
    return dpk
  }

  get = (): any => {
    return blsct.cast_to_dpk(this.obj)
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
    // rv.value (blsct_dpk) is not disposed since the ownership moves to dpk
    const dpk = DoublePublicKey.moveBlsctDoublePublicKey(rv.value, rv.value_size)
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

export class RangeProof extends DisposableObj<RangeProof> {
  constructor(rangeProof: any, rangeProofSize: number) {
    super(rangeProof, rangeProofSize)
  }

  get = (): any => {
    return blsct.cast_to_range_proof(this.obj)
  }
}

export class OutPoint extends DisposableObj<OutPoint> {
  constructor(txId: string, outIndex: number) {
    const rv = blsct.gen_out_point(txId, outIndex)
    super(rv.value, rv.value_size)
    blsct.free_obj(rv)
  }

  get = (): any => {
    return blsct.cast_to_out_point(this.obj)
  }
}

export class TxIn extends DisposableObj<TxIn> {
  constructor(txIn: any, txInSize: number) {
    super(txIn, txInSize)
  }

  static fromFields = (
    amount: number,
    gamma: number,
    spendingKey: Scalar,
    tokenId: TokenId,
    outPoint: OutPoint,
    rbf: boolean = false,
  ): TxIn => {
    const rv = blsct.build_tx_in(
      amount,
      gamma,
      spendingKey.get(),
      tokenId.get(),
      outPoint.get(),
      rbf,
    )
    const txIn = new TxIn(rv.value, rv.value_size)
    blsct.free_obj(rv)
    return txIn
  }

  get = (): any => {
    return blsct.cast_to_tx_in(this.obj)
  }
}

export class SubAddress extends DisposableObj<SubAddress> {
  constructor(dpk: DoublePublicKey) {
    const rv = blsct.dpk_to_sub_addr(dpk.get())
    super(rv.value, rv.value_size)
    blsct.free_obj(rv)
  }

  get = (): any => {
    return blsct.cast_to_sub_addr(this.obj)
  }
}

export type TxOutputType = 'Normal' | 'StakedCommitment'

export class TxOut extends DisposableObj<TxOut> {
  constructor(txOut: any, txOutSize: number) {
    super(txOut, txOutSize)
  }

  static fromFields = (
    subAddr: SubAddress,
    amount: number,
    memo: string,
    tokenId: TokenId | undefined = undefined,
    outputType: TxOutputType = 'Normal',
    minStake: number = 0,
  ): TxOut => {
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
    const txOut = new TxOut(rv.value, rv.value_size)
    blsct.free_obj(rv)
    return txOut
  }

  get = (): any => {
    return blsct.cast_to_tx_out(this.obj)
  }
}

export class Tx extends DisposableObj<Tx> {
  constructor(
    serTx: any,
    serTxSize: number,
  ) {
    super(serTx, serTxSize)
  }

  static fromTxInsTxOuts(
    txIns: TxIn[],
    txOuts: TxOut[],
  ): Tx {
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

    return new Tx(rv.ser_tx, rv.ser_tx_size)
  }

  get = (): any => {
    return blsct.cast_to_uint8_t_ptr(this.obj)
  }

  serialize = (): string => blsct.to_hex(this.get(), this.getSize())

  deserialize = (hex: string): Tx => {
    const ser_tx = blsct.hexToMallocedBuf(hex)
    const ser_tx_size = hex.length / 2
    return new Tx(ser_tx, ser_tx_size)  
  }

  getTxIns = (): TxIn[] => {
    const blsctTx = blsct.deserialize_tx(this.get(), this.getSize())
    const blsctTxIns = blsct.get_tx_ins(blsctTx)
    const txInsSize = blsct.get_tx_ins_size(blsctTxIns)
    const txIns = []

    for(let i=0; i<txInsSize; ++i) {
      const rv = blsct.get_tx_in(blsctTxIns, i)
      const txIn = new TxIn(rv.value, rv.value_size)
      txIns.push(txIn)
      blsct.free_obj(rv)
    }
    blsct.free_obj(blsctTx)

    return txIns
  }

  getTxOuts = (): TxOut[] => {
    const blsctTx = blsct.deserialize_tx(this.get(), this.getSize())
    const blsctTxOuts = blsct.get_tx_outs(blsctTx)
    const txOutsSize = blsct.get_tx_outs_size(blsctTxOuts)

    const txOuts = []

    for(let i=0; i<txOutsSize; ++i) {
      const rv = blsct.get_tx_out(blsctTxOuts, i)
      const txOut = new TxOut(rv.value, rv.value_size)
      txOuts.push(txOut)
      blsct.free_obj(rv) 
    }
    blsct.free_obj(blsctTx)

    return txOuts
  }
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

  private add2GC= (x: DisposableObj<any>): void => {
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
    dpk: any,
    dpk_size: number,
  ): DoublePublicKey => {
    const x = DoublePublicKey.moveBlsctDoublePublicKey(dpk, dpk_size)
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
    const x = TxIn.fromFields(
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
    const x = TxOut.fromFields(
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
    const x = Tx.fromTxInsTxOuts(
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
    const rangeProof = new RangeProof(rv.value, rv.value_size)
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

