const blsct = require('../build/Release/blsct') as any

export type AddressEncoding = 'Bech32' | 'Bech32M'

export class Computation {
  private gc: any[] = []

  constructor() {
    blsct.init()
  }

  add2GC = (x: any): void => {
    //console.log(`added to GC[${this.gc.length}]`)
    this.gc.push(x)

  }

  RandomScalar = (): Scalar => {
    return Scalar.random(this)
  }

  Scalar = (n: number): Scalar => {
    return Scalar.fromNumber(n, this)
  }

  RandomPoint = (): Point => {
    return Point.random(this)
  }

  ScalarToPublicKey = (scalar: Scalar): PublicKey => {
    return PublicKey.fromScalar(scalar, this)
  }

  PublicKey = (): PublicKey => {
    return PublicKey.random(this)
  }

  SubAddrId = (
    account: number,
    address: number,
  ) => {
    return SubAddrId.fromAcctAddr(account, address, this)
  }

  TokenId = (
    token: number | undefined = undefined,
    subid: number | undefined = undefined
  ): any => {
    return TokenId.fromTokenSubId(this, token, subid)
  }

  DoublcPublicKeyfromPubKeys = (
    pk1: PublicKey,
    pk2: PublicKey
  ): DoublePublicKey => {
    return DoublePublicKey.fromTwoPublicKeys(pk1, pk2, this)
  }

  DoublcPublicKeyFromBlsctDPK = (
    dpk: any,
    dpk_size: number,
  ): DoublePublicKey => {
    return DoublePublicKey.moveBlsctDoublePublicKey(
      dpk, dpk_size, this
    )
  }

  DoublcPublicKeyFromViewKeySpendingPubKeyAcctAddr = (
    viewKey: Scalar,
    spendingPubKey: PublicKey,
    account: number,
    address: number,
  ): DoublePublicKey => {
    return DoublePublicKey.fromViewKeySpendingPubKeyAcctAddr(
      viewKey,
      spendingPubKey,
      account,
      address,
      this,
    )
  }


  OutPoint = (
    txId: string,
    outIndex: number,
  ): OutPoint => {
    return new OutPoint(txId, outIndex, this)
  }

  TxIn = (
    amount: number,
    gamma: number,
    spendingKey: Scalar,
    tokenId: TokenId,
    outPoint: OutPoint,
    rbf: boolean = false,
  ): TxIn => {
    return TxIn.fromFields(
      amount,
      gamma,
      spendingKey,
      tokenId,
      outPoint,
      rbf,
      this,
    )
  }

  TxOut = (
    subAddr: SubAddress,
    amount: number,
    memo: string,
    tokenId: TokenId | undefined = undefined,
    outputType: TxOutputType = 'Normal',
    minStake: number = 0,
  ): TxOut => {
    return TxOut.fromFields(
      subAddr,
      amount,
      memo,
      tokenId,
      outputType,
      minStake,
      this,
    )
  }

  Tx = (
    txIns: TxIn[],
    txOuts: TxOut[],
  ): Tx => {
    return Tx.fromTxInsTxOuts(
      txIns,
      txOuts,
      this,
    )
  }

  SubAddress = (dpk: DoublePublicKey) => {
    return new SubAddress(dpk, this)
  }

  runGC = () => {
    let i = 0
    for(let x of this.gc) {
      blsct.free_obj(x)
      //console.log(`freed GC[${i}]`)
      i++
    }
    this.gc = []
  }

  ///

  fromSeedToChildKey = (seed: Scalar): Scalar => {
    const childKey = blsct.from_seed_to_child_key(seed.get())
    return new Scalar(childKey, this)
  }

  fromChildKeyToBlindingKey = (childKey: Scalar): Scalar => {
    const blindingKey = blsct.from_child_key_to_blinding_key(childKey.get())
    return new Scalar(blindingKey, this)
  }

  fromChildKeyToTokenKey = (childKey: Scalar): Scalar => {
    const tokenKey = blsct.from_child_key_to_token_key(childKey.get())
    return new Scalar(tokenKey, this)
  }

  fromChildKeyToTxKey = (childKey: Scalar): Scalar => {
    const txKey = blsct.from_child_key_to_tx_key(childKey.get())
    return new Scalar(txKey, this)
  }

  fromTxKeyToViewKey = (txKey: Scalar): Scalar => {
    const viewKey = blsct.from_tx_key_to_view_key(txKey.get())
    return new Scalar(viewKey, this)
  }

  fromTxKeyToSpendingKey = (txKey: Scalar): Scalar => {
    const spendingKey = blsct.from_tx_key_to_spending_key(txKey.get())
    return new Scalar(spendingKey, this)
  }

  calcPrivSpendingKey = (
    blindingPubKey: PublicKey,
    viewKey: Scalar,
    spendingKey: Scalar,
    account: number,
    address: number,
  ): Scalar => {
    const privSpendingKey = blsct.calc_priv_spending_key(
      blindingPubKey.get(),
      viewKey.get(),
      spendingKey.get(),
      account,
      address
    )
    return new Scalar(privSpendingKey, this)
  }

  calcViewTag = (
    blindingPubKey: PublicKey,
    viewKey: Scalar,
  ): number => {
    return blsct.calc_view_tag(
      blindingPubKey.get(),
      viewKey.get(),
    )
  }

  calcHashId = (
    blindingPubKey: PublicKey,
    spendingPubKey: PublicKey,
    viewKey: Scalar,
  ): KeyId => {
    const hashId = blsct.calc_hash_id(
      blindingPubKey.get(),
      spendingPubKey.get(),
      viewKey.get(),
    )
    return new KeyId(hashId, this)
  }

  calcNonce = (
    blindingPubKey: PublicKey,
    viewKey: Scalar,
  ): PublicKey => {
    const blsct_nonce = blsct.calc_nonce(
      blindingPubKey.get(),
      viewKey.get(),
    )
    return new Point(blsct_nonce, this)
  }

  deriveSubAddr = (
    viewKey: Scalar,
    spendingPubKey: PublicKey,
    subAddrId: SubAddrId,
  ): SubAddr => {
    return SubAddr.derive(
      viewKey,
      spendingPubKey,
      subAddrId,
      this,
    )
  }

  decodeAddress = (
    encodedAddr: string,
  ): DoublePublicKey => {
    return AddressUtil.decode(encodedAddr, this)
  }

  encodeAddress = (
    dpk: DoublePublicKey,
    encoding: AddressEncoding = 'Bech32M',
  ): string => {
    return AddressUtil.encode(
      dpk, encoding, this
    )
  }

  signMessage = (privKey: Scalar, msg: string) => {
    const sig = blsct.sign_message(privKey.get(), msg)
    return new Signature(sig, blsct.SIGNATURE_SIZE, this)
  }

  verifyMessage = (pubKey: PublicKey, msg: string, sig: Signature): boolean => {
    return blsct.verify_msg_sig(pubKey.get(), msg, sig.get())
  }

  buildRangeProof = (
    vs: number[],
    nonce: Point,
    msg: string,
    tokenId: TokenId | undefined = undefined,
  ): RangeProof => {
    const vsVec = blsct.create_uint64_vec()
    for(let v of vs) {
      blsct.add_to_uint64_vec(vsVec, v)
    }

    let paramTokenId = tokenId
    if (paramTokenId === undefined) {
      paramTokenId = TokenId.fromTokenSubId(this)
    }
    let rv = blsct.build_range_proof(
      vsVec,
      nonce.get(),
      msg,
      paramTokenId.get(),
    )
    blsct.free_uint64_vec(vsVec)
    
    if (rv.result !== 0) {
      blsct.free_obj(rv)
      throw new Error(`Building range proof failed: ${rv.result}`)
    }
    const rangeProof = new RangeProof(rv.value, rv.value_size, this)
    blsct.free_obj(rv)
 
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

abstract class DisposableObj<T extends DisposableObj<any>> {
  protected obj: any = undefined
  protected objSize: number
  protected computation: Computation

  constructor(obj: any, objSize: number, computation: Computation) {
    this.obj = obj
    this.objSize = objSize
    this.computation = computation
    computation.add2GC(obj)
  }

  abstract get: () => any

  getSize = (): number => this.objSize

  dispose = (): void => {
    if (this.obj !== undefined) {
      blsct.free_obj(this.obj)
      this.obj = undefined  // avoid accidentally disposing a disposed object
    }
  }

  serialize = (): string => blsct.to_hex(this.get(), this.objSize)

  deserialize = (hex: string): T => {
    const serObj = blsct.hexToMallocedBuf(hex)
    const serObjSize = hex.length / 2
    return new (this.constructor as any)(serObj, serObjSize) as T 
  }

  toString = (): string => this.serialize()
}

export class Scalar extends DisposableObj<Scalar> {
  constructor(scalar: any, computation: Computation) {
    super(scalar, blsct.SCALAR_SIZE, computation)
  }

  static fromNumber(n: number, computation: Computation) {
    const rv = blsct.gen_scalar(n)
    const scalar = new Scalar(rv.value, computation)
    blsct.free_obj(rv)
    return scalar
  }

  static random = (computation: Computation): Scalar => {
    const rv = blsct.gen_random_scalar()
    const scalar = new Scalar(rv.value, computation)
    blsct.free_obj(rv)
    return scalar
  }

  get = (): any => {
    return blsct.cast_to_scalar(this.obj)
  }

  toNumber(): number {
    return blsct.scalar_to_uint64(this.get())
  }

  toHex = (): string => {
    return blsct.scalar_to_hex(this.get())
  }

  toPublicKey = (): PublicKey => {
    return PublicKey.fromScalar(this, this.computation)
  }
}

export class Point extends DisposableObj<Point> {
  constructor(point: any, computation: Computation) {
    super(point, blsct.POINT_SIZE, computation)
  }

  static random = (computation: Computation): Point => {
    const rv = blsct.gen_random_point()
    const point = new Point(rv.value, computation)
    blsct.free_obj(rv)
    return point
  }

  isValid = (): boolean => {
    return blsct.is_valid_point(this.get())
  }

  get = (): any => {
    return blsct.cast_to_point(this.obj)
  }

  toHex = (): string => {
    return blsct.point_to_hex(this.get())
  }
}

export class PublicKey extends DisposableObj<PublicKey> {
  constructor(pubKey: any, computation: Computation) {
    super(pubKey, blsct.PUBLIC_KEY_SIZE, computation)
  }

  static random = (computation: Computation): PublicKey => {
    const rv = blsct.gen_random_public_key()
    const pubKey = blsct.cast_to_pub_key(rv.value)
    const pubKeyObj = new PublicKey(pubKey, computation)
    blsct.free_obj(rv)
    return pubKeyObj
  }

  static fromScalar = (scalar: Scalar, computation: Computation): PublicKey => {
    const pubKey = blsct.scalar_to_pub_key(scalar.get())
    return new PublicKey(pubKey, computation)
  }
  
  get = (): any => {
    return blsct.cast_to_pub_key(this.obj)
  }
}

export class PrivateKey extends DisposableObj<PrivateKey> {
  constructor(compuration: Computation) {
    const rv = blsct.gen_random_scalar()
    const pubKey = blsct.cast_to_pub_key(rv.value)
    super(pubKey, rv.value_size, compuration)
    blsct.free_obj(rv)
  }

  get = (): any => {
    return blsct.cast_to_pub_key(this.obj)
  }
}

export class KeyId extends DisposableObj<KeyId> {
  constructor(keyId: any, computation: Computation) {
    super(keyId, blsct.KEY_ID_SIZE, computation)
  }

  get = (): any => {
    return blsct.cast_to_key_id(this.obj)
  }

  toHex = (): string => {
    return blsct.get_key_id_hex(this.get())
  }
}

export class SubAddrId extends DisposableObj<SubAddrId> {
  constructor(subAddrId: any, computation: Computation) {
    super(subAddrId, blsct.SUB_ADDR_ID_SIZE, computation)
  }

  get = (): any => {
    return blsct.cast_to_sub_addr_id(this.obj)
  }

  static fromAcctAddr = (
    account: number,
    address: number,
    computation: Computation,
  ): SubAddrId => {
    const obj = blsct.gen_sub_addr_id(account, address);
    return new SubAddrId(obj, computation)
  }

  getAccount = (): number => {
    return blsct.get_sub_addr_id_account(this.get())
  }

  getAddress = (): number => {
    return blsct.get_sub_addr_id_address(this.get())
  }
}

export class SubAddr extends DisposableObj<SubAddr> {
  constructor(subAddr: any, computation: Computation) {
    super(subAddr, blsct.SUB_ADDR_SIZE, computation)
  }

  get = (): any => {
    return blsct.cast_to_sub_addr(this.obj)
  }

  static derive = (
    viewKey: Scalar,
    spendingPubKey: PublicKey,
    subAddrId: SubAddrId,
    computation: Computation,
  ): SubAddr => {
    const obj = blsct.derive_sub_address(
      viewKey.get(),
      spendingPubKey.get(),
      subAddrId.get(),
    )
    return new SubAddr(obj, computation)
  }
}

export class TokenId extends DisposableObj<TokenId> {
  constructor(
    tokenId: any,
    tokenIdSize: number,
    computation: Computation,
  ) {
    super(tokenId, tokenIdSize, computation)
  }

  static fromTokenSubId = (
    computation: Computation,
    token: number | undefined = undefined,
    subid: number | undefined = undefined,
  ): TokenId => {
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
    const tokenId = new TokenId(rv.value, rv.value_size, computation)
    blsct.free_obj(rv)

    return tokenId
  }

  get = (): any => {
    return blsct.cast_to_token_id(this.obj)
  }

  getToken = (): number => {
    return blsct.get_token_id_token(this.get())
  }

  getSubid = (): number => {
    return blsct.get_token_id_subid(this.get())
  }
}

export class Signature extends DisposableObj<Signature> {
  constructor(
    signature: any,
    signatureSize: number,
    computation: Computation,
  ) {
    super(signature, signatureSize, computation)
  }

  get = (): any => {
    return blsct.cast_to_signature(this.obj)
  }
}

export class DoublePublicKey extends DisposableObj<DoublePublicKey> {
  private constructor(
    dpk: any,
    computation: Computation,
  ) {
    const typedDpk = blsct.cast_to_dpk(dpk)
    super(typedDpk, blsct.DOUBLE_PUBLIC_KEY_SIZE, computation);
  }

  // the ownership of `blsct_dpk` moves to this instance from the caller
  static moveBlsctDoublePublicKey = (
    dpk: any,
    dpkSize: number,
    computation: Computation,
  ): DoublePublicKey => {
    return new DoublePublicKey(dpk, computation)
  }

  static fromTwoPublicKeys = (
    pk1: PublicKey,
    pk2: PublicKey,
    computation: Computation,
  ): DoublePublicKey => {
    const rv = blsct.gen_double_pub_key(
      pk1.get(), pk2.get()
    )
    if (rv.result !== 0) {
      throw new Error(`Failed to generate a double public key: ${rv.result}`)
    }
    const dpk = new DoublePublicKey(rv.value, computation)
    blsct.free_obj(rv)
    return dpk
  }

  static fromViewKeySpendingPubKeyAcctAddr = (
    viewKey: Scalar,
    spendingPubKey: PublicKey,
    account: number,
    address: number,
    computation: Computation,
  ): DoublePublicKey => {
    const obj = blsct.gen_dpk_with_keys_and_sub_addr_id(
      viewKey.get(),
      spendingPubKey.get(),
      account,
      address,
    )
    return new DoublePublicKey(obj, computation) 
  }

  get = (): any => {
    return blsct.cast_to_dpk(this.obj)
  }
}

export class AddressUtil {
  static decode(
    encodedAddr: string,
    computation: Computation,
  ): DoublePublicKey {
    const rv = blsct.decode_address(encodedAddr) 
    if (rv.result !== 0) {
      throw new Error(`Failed to decode address: ${rv.result}`)
    }
    // rv.value (blsct_dpk) is not disposed since the ownership moves to dpk
    const dpk = DoublePublicKey.moveBlsctDoublePublicKey(
      rv.value, rv.value_size, computation
    )
    blsct.free_obj(rv)

    return dpk 
  }

  static encode(
    dpk: DoublePublicKey,
    encoding: AddressEncoding = 'Bech32M',
    computation: Computation,
  ): string {
    const rv = blsct.encode_address(
      dpk.get(),
      encoding === 'Bech32' ? blsct.Bech32 : blsct.Bech32M
    )
    if (rv.result !== 0) {
      throw new Error(`Encoding address failed: ${rv.result}`)
    }
    computation.add2GC(rv.value)

    const enc_addr = blsct.as_string(rv.value)
    blsct.free_obj(rv)

    return enc_addr
  }
}

export class RangeProof extends DisposableObj<RangeProof> {
  constructor(
    rangeProof: any,
    rangeProofSize: number,
    computation: Computation,
  ) {
    super(rangeProof, rangeProofSize, computation)
  }

  get = (): any => {
    return blsct.cast_to_range_proof(this.obj)
  }
}

export class OutPoint extends DisposableObj<OutPoint> {
  constructor(
    txId: string,
    outIndex: number,
    computation: Computation,
  ) {
    const rv = blsct.gen_out_point(txId, outIndex)
    super(rv.value, rv.value_size, computation)
    blsct.free_obj(rv)
  }

  get = (): any => {
    return blsct.cast_to_out_point(this.obj)
  }
}

export class TxIn extends DisposableObj<TxIn> {
  constructor(
    txIn: any,
    txInSize: number,
    computation: Computation,
  ) {
    super(txIn, txInSize, computation)
  }

  static fromFields = (
    amount: number,
    gamma: number,
    spendingKey: Scalar,
    tokenId: TokenId,
    outPoint: OutPoint,
    rbf: boolean,
    computation: Computation,
  ): TxIn => {
    const rv = blsct.build_tx_in(
      amount,
      gamma,
      spendingKey.get(),
      tokenId.get(),
      outPoint.get(),
      rbf,
    )
    const txIn = new TxIn(rv.value, rv.value_size, computation)
    blsct.free_obj(rv)
    return txIn
  }

  get = (): any => {
    return blsct.cast_to_tx_in(this.obj)
  }

  getPrevOutHash = (): TxId => {
    const txId = blsct.get_tx_in_prev_out_hash(this.get())
    return new TxId(txId, blsct.TX_ID_SIZE, this.computation)
  }

  getPrevOutN = (): number => {
    return blsct.get_tx_in_prev_out_n(this.get())
  }

  getScriptSig = (): Script => {
    const scriptSig = blsct.get_tx_in_script_sig(this.get())
    return new Script(scriptSig, blsct.SCRIPT_SIZE, this.computation)
  }

  getSequence = (): number => {
    return blsct.get_tx_in_sequence(this.get())
  }

  getScriptWitness = (): Script => {
    const scriptWitness = blsct.get_tx_in_script_witness(this.get())
    return new Script(scriptWitness, blsct.SCRIPT_SIZE, this.computation)
  }
}

export class SubAddress extends DisposableObj<SubAddress> {
  constructor(dpk: DoublePublicKey, computation: Computation) {
    const rv = blsct.dpk_to_sub_addr(dpk.get())
    super(rv.value, rv.value_size, computation)
    blsct.free_obj(rv)
  }

  get = (): any => {
    return blsct.cast_to_sub_addr(this.obj)
  }
}

export type TxOutputType = 'Normal' | 'StakedCommitment'

export class TxOut extends DisposableObj<TxOut> {
  constructor(
    txOut: any,
    txOutSize: number,
    computation: Computation,
  ) {
    super(txOut, txOutSize, computation)
  }

  static fromFields = (
    subAddr: SubAddress,
    amount: number,
    memo: string,
    tokenId: TokenId | undefined = undefined,
    outputType: TxOutputType = 'Normal',
    minStake: number,
    computation: Computation,
  ): TxOut => {
    const paramTokenId =
      tokenId === undefined ?
        TokenId.fromTokenSubId(computation) : tokenId
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
    const txOut = new TxOut(rv.value, rv.value_size, computation)
    blsct.free_obj(rv)
    return txOut
  }

  get = (): any => {
    return blsct.cast_to_tx_out(this.obj)
  }

  getValue = (): number => {
    return blsct.get_tx_out_value(this.get())
  }

  getScriptPubKey = (): Script => {
    const scriptPubKey = blsct.get_tx_out_script_pubkey(this.get())
    return new Script(scriptPubKey, blsct.SCRIPT_SIZE, this.computation)
  }

  getSpendingKey = (): Point => {
    const key = blsct.get_tx_out_spending_key(this.get())
    return new Point(key, this.computation)
  }

  getEphemeralKey = (): Point => {
    const key = blsct.get_tx_out_ephemeral_key(this.get())
    return new Point(key, this.computation)
  }

  getBlindingKey = (): Point => {
    const key = blsct.get_tx_out_blinding_key(this.get())
    return new Point(key, this.computation)
  }

  getViewTag = (): number => {
    return blsct.get_tx_out_view_tag(this.get())
  }

  getRangeProof_A = (): Point => {
    const point = blsct.get_tx_out_range_proof_A(this.get())
    return new Point(point, this.computation)
  }

  getRangeProof_S = (): Point => {
    const point = blsct.get_tx_out_range_proof_S(this.get())
    return new Point(point, this.computation)
  }

  getRangeProof_T1 = (): Point => {
    const point = blsct.get_tx_out_range_proof_T1(this.get())
    return new Point(point, this.computation)
  }

  getRangeProof_T2 = (): Point => {
    const point = blsct.get_tx_out_range_proof_T2(this.get())
    return new Point(point, this.computation)
  }

  getRangeProof_mu = (): Scalar => {
    const scalar = blsct.get_tx_out_range_proof_mu(this.get())
    return new Scalar(scalar, this.computation)
  }

  getRangeProof_a = (): Scalar => {
    const scalar = blsct.get_tx_out_range_proof_a(this.get())
    return new Scalar(scalar, this.computation)
  }

  getRangeProof_b = (): Scalar => {
    const scalar = blsct.get_tx_out_range_proof_b(this.get())
    return new Scalar(scalar, this.computation)
  }

  getRangeProof_t_hat = (): Scalar => {
    const scalar = blsct.get_tx_out_range_proof_t_hat(this.get())
    return new Scalar(scalar, this.computation)
  }

  getTokenId = (): TokenId => {
    const tokenId = blsct.get_tx_out_token_id(this.get())
    return new TokenId(tokenId, blsct.TOKEN_ID_SIZE, this.computation)
  }
}

export class Script extends DisposableObj<Scalar> {
  constructor(script: any, scriptSize: number, computation: Computation) {
    super(script, scriptSize, computation)
  }

  get = (): any => {
    return blsct.cast_to_cscript(this.obj)
  }

  toHex = (): string => {
    const buf = blsct.cast_to_uint8_t_ptr(this.get())
    return blsct.to_hex(buf, blsct.SCRIPT_SIZE)
  }
}

export class TxId extends DisposableObj<Scalar> {
  constructor(txId: any, txIdSize: number, computation: Computation) {
    super(txId, txIdSize, computation)
  }

  get = (): any => {
    return blsct.cast_to_uint8_t_ptr(this.obj)
  }

  toHex = (): string => {
    const buf = blsct.cast_to_uint8_t_ptr(this.get())
    return blsct.to_hex(buf, blsct.TX_ID_SIZE)
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

class Tx extends DisposableObj<Tx> {
  private constructor(
    serTx: any,
    serTxSize: number,
    computation: Computation,
  ) {
    super(serTx, serTxSize, computation)
    this.computation = computation
  }

  static fromTxInsTxOuts(
    txIns: TxIn[],
    txOuts: TxOut[],
    computation: Computation,
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

    return new Tx(
      rv.ser_tx,
      rv.ser_tx_size,
      computation,
    )
  }

  get = (): any => {
    return blsct.cast_to_uint8_t_ptr(this.obj)
  }

  serialize = (): string => blsct.to_hex(this.get(), this.getSize())

  deserialize = (hex: string): Tx => {
    const ser_tx = blsct.hexToMallocedBuf(hex)
    const ser_tx_size = hex.length / 2
    const tx = new Tx(ser_tx, ser_tx_size, this.computation)  
    return tx
  }

  getTxIns = (): TxIn[] => {
    const blsctTx = blsct.deserialize_tx(this.get(), this.getSize())
    const blsctTxIns = blsct.get_tx_ins(blsctTx)
    const txInsSize = blsct.get_tx_ins_size(blsctTxIns)

    const txIns: any = []

    for(let i=0; i<txInsSize; ++i) {
      const rv = blsct.get_tx_in(blsctTxIns, i)
      const txIn = new TxIn(rv.value, rv.value_size, this.computation)
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

    const txOuts: any = []

    for(let i=0; i<txOutsSize; ++i) {
      const rv = blsct.get_tx_out(blsctTxOuts, i)
      const txOut = new TxOut(rv.value, rv.value_size, this.computation)
      txOuts.push(txOut)
      blsct.free_obj(rv) 
    }
    blsct.free_obj(blsctTx)

    return txOuts
  }
}

