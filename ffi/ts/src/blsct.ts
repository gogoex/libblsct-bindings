import assert from 'node:assert'

const blsct = require('../build/Release/blsct.node')

if (!blsct._initialized) {
  blsct.init()
  blsct._initialized = true
}

export const CTX_ID_SIZE = blsct.CTX_ID_SIZE
export const POINT_SIZE = blsct.POINT_SIZE
export const SCRIPT_SIZE = blsct.SCRIPT_SIZE
export const BLSCT_IN_AMOUNT_ERROR = blsct.BLSCT_IN_AMOUNT_ERROR
export const BLSCT_OUT_AMOUNT_ERROR = blsct.BLSCT_OUT_AMOUNT_ERROR

export enum TxOutputType {
  Normal,
  StakedCommitment,
}

export interface BlsctRetVal {
  value: any
  value_size: number
  result: number
}

export interface BlsctAmountsRetVal{
  result: number
  value: any
}

export interface BlsctBoolRetVal {
  value: boolean,
  result: number
}

export interface BlsctCtxRetVal {
  result: number
  ser_ctx: any
  ser_ctx_size: number
  in_amount_err_index: number
  out_amount_err_index: number
}

// address
export const decodeAddress = (addrStr: string): BlsctRetVal => {
  return blsct.decode_address(addrStr)
}
export const encodeAddress = (
  dpk: any,
  encoding: number
): BlsctRetVal => {
  return blsct.encode_address(dpk, encoding)
}
export const Bech32 = blsct.Bech32
export const Bech32M = blsct.Bech32M

// child key
export const fromSeedToChildKey = (seed: any): any => {
  return blsct.from_seed_to_child_key(seed)
}
export const fromChildKeyToBlindingKey = (childKey: any): any => {
  return blsct.from_child_key_to_blinding_key(childKey)
}
export const fromChildKeyToTokenKey = (childKey: any): any => {
  return blsct.from_child_key_to_token_key(childKey)
}
export const fromChildKeyToTxKey = (childKey: any): any => {
  return blsct.from_child_key_to_tx_key(childKey)
}

// ctx
export const addTxInToVec = (vec: any, txIn: any): void => {
  return blsct.add_tx_in_to_vec(vec, txIn)
}

export const addTxOutToVec = (vec: any, txOut: any): void => {
  return blsct.add_tx_out_to_vec(vec, txOut)
}

export const buildCTx = (txIns: any, txOuts: any): BlsctCtxRetVal => {
  return blsct.build_ctx(txIns, txOuts)
}

export const createTxInVec = (): any => {
  return blsct.create_tx_in_vec()
}

export const createTxOutVec = (): any => {
  return blsct.create_tx_out_vec()
}

export const getCTxId = (ctx: any, objSize: number): string => {
  return blsct.get_ctx_id(ctx, objSize)
}

export const getCTxIn = (ctxIns: any, i: number): BlsctRetVal => {
  return blsct.get_ctx_in(ctxIns, i)
}

export const getCTxInCount = (ctxIn: any): number => {
  return blsct.get_ctx_in_count(ctxIn)
}

export const getCTxIns = (ctx: any, objSize: number): any => {
  return blsct.get_ctx_ins(ctx, objSize)
}

export const getCTxOut = (ctxOuts: any, i: number): BlsctRetVal => {
  return blsct.get_ctx_out(ctxOuts, i)
}

export const getCTxOutCount = (ctx: any): number => {
  return blsct.get_ctx_out_count(ctx)
}

export const getCTxOuts = (ctx: any, objSize: number): any => {
  return blsct.get_ctx_outs(ctx, objSize)
}

// ctx id
export const serializeCTxId = (ctxId: any): string => {
  return blsct.serialize_ctx_id(ctxId)
}

// ctx in
export const getCTxInPrevOutHash = (obj: any): any => {
  return blsct.get_ctx_in_prev_out_hash(obj)
}
export const getCTxInPrevOutN = (obj: any): number => {
  return blsct.get_ctx_in_prev_out_n(obj)
}
export const getCTxInScriptSig = (obj: any): any => {
  return blsct.get_ctx_in_script_sig(obj)
}
export const getCTxInSequence = (obj: any): number => {
  return blsct.get_ctx_in_sequence(obj)
}
export const getCTxInScriptWitness = (obj: any): any => {
  return blsct.get_ctx_in_script_witness(obj)
}

// ctx out
export const getCTxOutValue = (obj: any): number => {
  return blsct.get_ctx_out_value(obj)
}

export const getCTxOutScriptPubkey = (obj: any): any => {
  return blsct.get_ctx_out_script_pubkey(obj)
}

export const getCTxOutTokenId = (obj: any): any => {
  return blsct.get_ctx_out_token_id(obj)
}

export const getCTxOutVectorPredicate = (obj: any): BlsctRetVal => {
  return blsct.get_ctx_out_vector_predicate(obj)
}

// ctx out blsct data
export const getCTxOutBlindingKey = (obj: any): any => {
  return blsct.get_ctx_out_blinding_key(obj)
}

export const getCTxOutEphemeralKey = (obj: any): any => {
  return blsct.get_ctx_out_ephemeral_key(obj)
}

export const getCTxOutSpendingKey = (obj: any): any => {
  return blsct.get_ctx_out_spending_key(obj)
}

export const getCTxOutRangeProof = (obj: any): BlsctRetVal => {
  return blsct.get_ctx_out_range_proof(obj)
}

export const getCTxOutViewTag = (obj: any): number => {
  return blsct.get_ctx_out_view_tag(obj)
}

// double public key
export const deserializeDpk = (hex: string): BlsctRetVal => {
  return blsct.deserialize_dpk(hex)
}
export const genDoublePubKey = (pk1: any, pk2: any): BlsctRetVal => {
  return blsct.gen_double_pub_key(pk1, pk2)
}
export const genDpkWithKeysAndSubAddrId = (
  viewKey: any,
  spendingPubKey: any,
  account: number,
  address: number
): any => {
  return blsct.gen_dpk_with_keys_and_sub_addr_id(
    viewKey,
    spendingPubKey,
    account,
    address
  )
}
export const serializeDpk = (dpk: any): string => {
  return blsct.serialize_dpk(dpk)
}

// hash id
export const calcKeyId = (
  blindingPubKey: any,
  spendingPubKey: any,
  viewKey: any
): any => {
  return blsct.calc_key_id(blindingPubKey, spendingPubKey, viewKey)
}
export const deserializeKeyId = (hex: string): BlsctRetVal => {
  return blsct.deserialize_key_id(hex)
}
export const serializeKeyId = (hashId: any): string => {
  return blsct.serialize_key_id(hashId)
}

// misc
export const freeObj = (obj: any): void => {
  if (obj !== null && obj !== undefined) {
    blsct.free_obj(obj)
  }
}
export const hexToMallocedBuf = (hex: string): any => {
  return blsct.hex_to_malloced_buf(hex)
}
export const runGc = async (): Promise<void> => {
  if (typeof global.gc === 'function') {
    ;(global as any).gc()
    await new Promise(r =>
      setImmediate(r)
    )
  } else {
    console.warn('Garbage collector is not exposed. Run Node.js with --expose-gc to expose it.')
  }
}
export const toHex = (buf: any, size: number): string => {
  return blsct.to_hex(buf, size)
}
export const getValueAsCStr = (rv: BlsctRetVal): string => {
  return blsct.as_string(rv.value)
}

// out point
export const deserializeOutPoint = (hex: string): BlsctRetVal => {
  return blsct.deserialize_out_point(hex)
}
export const genOutPoint = (serCtxId: string, outIndex: number): any => {
  return blsct.gen_out_point(serCtxId, outIndex)
}
export const serializeOutPoint = (outPoint: any): string => {
  return blsct.serialize_out_point(outPoint)
}

// point
export const deserializePoint = (hex: string): BlsctRetVal => {
  return blsct.deserialize_point(hex)
}
export const genBasePoint = (): BlsctRetVal => {
  return blsct.gen_base_point()
}
export const genRandomPoint = (): BlsctRetVal => {
  return blsct.gen_random_point()
}
export const isPointEqual = (a: any, b: any): boolean => {
  return blsct.is_point_equal(a, b) !== 0
}
export const isValidPoint = (point: any): boolean => {
  return blsct.is_valid_point(point) !== 0
}
export const pointFromScalar = (scalar: any): any => {
  return blsct.point_from_scalar(scalar)
}
export const pointToStr = (point: any): any => {
  return blsct.point_to_str(point)
}
export const serializePoint = (point: any): string => {
  return blsct.serialize_point(point)
}

// priv spending key
export const calcPrivSpendingKey = (
  blindingPubKey: any,
  viewKey: any,
  spendingKey: any,
  account: number,
  address: number): any => {

  return blsct.calc_priv_spending_key(
    blindingPubKey,
    viewKey,
    spendingKey,
    account,
    address
  )
}

// public key
export const calcNonce = (blindingPubKey: any, viewKey: any): any => {
  return blsct.calc_nonce(blindingPubKey, viewKey)
}
export const genRandomPublicKey = (): BlsctRetVal => {
  return blsct.gen_random_public_key()
}
export const getPublicKeyPoint = (obj: any): any => {
  return blsct.get_public_key_point(obj)
}
export const pointToPublicKey = (point: any): any => {
  return blsct.point_to_public_key(point)
}
export const scalarToPubKey = (scalar: any): any => {
  return blsct.scalar_to_pub_key(scalar)
}

// range proof
export const addRangeProofToVec = (
  rangeProofs: any,
  numRangeProofs: number,
  rangeProof: any,
): void => {
  blsct.add_range_proof_to_vec(
    rangeProofs,
    numRangeProofs,
    rangeProof
  )
}
export const addToAmountRecoveryReqVec = (
  reqs: any[],
  req: any,
): void => {
  blsct.add_to_amount_recovery_req_vec(reqs, req)
}
export const addToUint64Vec = (vec: any, n: number): void => {
  blsct.add_to_uint64_vec(vec, n)
}
export const buildRangeProof = (
  amounts: any,
  nonce: any,
  msg: any,
  token_id: any,
): BlsctRetVal => {
  return blsct.build_range_proof(
    amounts,
    nonce,
    msg,
    token_id,
  )
}
export const createAmountRecoveryReqVec = (): any => {
  return blsct.create_amount_recovery_req_vec()
}
export const createRangeProofVec = (): any => {
  return blsct.create_range_proof_vec()
}
export const createUint64Vec = (): any => {
  return blsct.create_uint64_vec()
}
export const deserializeRangeProof = (hex: string): BlsctRetVal => {
  assert(hex.length % 2 === 0)
  const objSize = hex.length / 2
  return blsct.deserialize_range_proof(hex, objSize)
}
export const freeAmountRecoveryReqVec = (reqs: any): void => {
  blsct.free_amount_recovery_req_vec(reqs)
}
export const freeAmountsRetVal = (rv: BlsctAmountsRetVal): void => {
  blsct.free_amounts_ret_val(rv)
}
export const freeRangeProofVec = (rangeProofs: any): void => {
  blsct.free_range_proof_vec(rangeProofs)
}
export const freeUint64Vec = (vec: any): any => {
  blsct.free_uint64_vec(vec)
}
export const genAmountRecoveryReq = (
    rangeProof: any,
    rangeProofSize: number,
    nonce: any,
): any => {
  return blsct.gen_amount_recovery_req(
    rangeProof,
    rangeProofSize,
    nonce,
  )
}
export const getAmountRecoveryResultAmount = (
  req: any,
  i: number,
): number => {
  return blsct.get_amount_recovery_result_amount(req, i)
}
export const getAmountRecoveryResultIsSucc = (
  req: any,
  i: number,
): boolean => {
  return blsct.get_amount_recovery_result_is_succ(req, i)
}
export const getAmountRecoveryResultMsg = (
  req: any,
  i: number,
): string => {
  return blsct.get_amount_recovery_result_msg(req, i)
}
export const getAmountRecoveryResultSize = (
  resVec: any,
): number => {
  return blsct.get_amount_recovery_result_size(resVec)
}
export const getRangeProof_A = (rangeProof: any, rangeProofSize: number): any => {
  return blsct.get_range_proof_A(rangeProof, rangeProofSize)
}
export const getRangeProof_alpha_hat = (rangeProof: any, rangeProofSize: number): any => {
  return blsct. get_range_proof_alpha_hat(rangeProof, rangeProofSize)
}
export const getRangeProof_A_wip = (rangeProof: any, rangeProofSize: number): any => {
  return blsct.get_range_proof_A_wip(rangeProof, rangeProofSize)
}
export const getRangeProof_B = (rangeProof: any, rangeProofSize: number): any => {
  return blsct.get_range_proof_B(rangeProof, rangeProofSize)
}
export const getRangeProof_delta_prime = (rangeProof: any, rangeProofSize: number): any => {
  return blsct. get_range_proof_delta_prime(rangeProof, rangeProofSize)
}
export const getRangeProof_r_prime = (rangeProof: any, rangeProofSize: number): any => {
  return blsct. get_range_proof_r_prime(rangeProof, rangeProofSize)
}
export const getRangeProof_s_prime = (rangeProof: any, rangeProofSize: number): any => {
  return blsct. get_range_proof_s_prime(rangeProof, rangeProofSize)
}
export const getRangeProof_t_aux = (rangeProof: any, rangeProofSize: number): any => {
  return blsct. get_range_proof_tau_x(rangeProof, rangeProofSize)
}
export const recoverAmount = (vec: any): BlsctAmountsRetVal => {
  return blsct.recover_amount(vec)
}
export const serializeRangeProof = (rangeProof: any, rangeProofSize: number): string => {
  return blsct.serialize_range_proof(rangeProof, rangeProofSize)
}
export const verifyRangeProofs = (rangeProofs: any[]): BlsctBoolRetVal => {
  return blsct.verify_range_proofs(rangeProofs)
}

// scalar
export const deserializeScalar = (hex: string): BlsctRetVal => {
  return blsct.deserialize_scalar(hex)
}
export const genRandomScalar = (): BlsctRetVal => {
  return blsct.gen_random_scalar()
}
export const genScalar = (value: number): BlsctRetVal => {
  return blsct.gen_scalar(value)
}
export const isScalarEqual = (a: any, b: any): boolean => {
  return blsct.is_scalar_equal(a, b) !== 0
}
export const scalarToUint64 = (scalar: any): number => {
  return blsct.scalar_to_uint64(scalar)
}
export const serializeScalar = (scalar: any): string => {
  return blsct.serialize_scalar(scalar)
}

// script
export const deserializeScript = (hex: string): any => {
  return blsct.deserialize_script(hex)
}
export const serializeScript = (script: any): string => {
  return blsct.serialize_script(script)
}

// signature
export const deserializeSignature = (hex: string): any => {
  return blsct.deserialize_signature(hex)
}
export const serializeSignature = (script: any): string => {
  return blsct.serialize_signature(script)
}
export const signMessage = (
  privKey: any,
  msg: string,
): any => {
  return blsct.sign_message(privKey, msg)
}
export const verifyMsgSig = (
  pubKey: any,
  msg: string,
  signature: any,
): boolean => {
  return blsct.verify_msg_sig(pubKey, msg, signature)
}

// sub addr
export const deriveSubAddress = (
  viewKey: any,
  spendingPubKey: any,
  subAddrId: any, 
): any => {
  return blsct.derive_sub_address(
    viewKey,
    spendingPubKey,
    subAddrId, 
  )
}
export const deserializeSubAddr = (hex: string): any => {
  return blsct.deserialize_sub_addr(hex)
}
export const dpkToSubAddr = (dpk: any): BlsctRetVal => {
  return blsct.dpk_to_sub_addr(dpk)
}
export const serializeSubAddr = (subAddrId: any): string => {
  return blsct.serialize_sub_addr(subAddrId)
}

// sub addr id
export const deserializeSubAddrId = (hex: string): any => {
  return blsct.deserialize_sub_addr_id(hex)
}
export const genSubAddrId = (
  account: number,
  address: number,
): any => {
  return blsct.gen_sub_addr_id(account, address)
}
export const serializeSubAddrId = (subAddrId: any): string => {
  return blsct.serialize_sub_addr_id(subAddrId)
}

// token id
export const deserializeTokenId = (hex: string): BlsctRetVal => {
  return blsct.deserialize_token_id(hex)
}
export const genTokenId = (token: number): BlsctRetVal => {
  return blsct.gen_token_id(token)
}
export const genTokenIdWithSubid = (token: number, subid: number): BlsctRetVal => {
  return blsct.gen_token_id_with_subid(token, subid)
}
export const genDefaultTokenId = (): BlsctRetVal => {
  return blsct.gen_default_token_id()
}
export const getTokenIdSubid = (tokenId: any): number => {
  return blsct.get_token_id_subid(tokenId)
}
export const getTokenIdToken = (tokenId: any): number => {
  return blsct.get_token_id_token(tokenId)
}
export const serializeTokenId = (tokenId: any): string => {
  return blsct.serialize_token_id(tokenId)
}

// tx key
export const fromTxKeyToSpendingKey = (txKey: any): any => {
  return blsct.from_tx_key_to_spending_key(txKey)
}
export const fromTxKeyToViewKey = (txKey: any): any => {
  return blsct.from_tx_key_to_view_key(txKey)
}

// tx in
export const buildTxIn = (
  amount: number,
  gamma: number,
  spendingKey: any,
  tokenId: any,
  outPoint: any,
  isStakedCommitment: boolean,
  isRbf: boolean,
): any => {
  return blsct.build_tx_in(
    amount,
    gamma,
    spendingKey,
    tokenId,
    outPoint,
    isStakedCommitment,
    isRbf,
  )
}

export const getTxInAmount = (obj: any): number => {
  return blsct.get_tx_in_amount(obj)
}

export const getTxInGamma = (obj: any): number => {
  return blsct.get_tx_in_gamma(obj)
}

export const getTxInSpendingKey = (obj: any): any => {
  return blsct.get_tx_in_spending_key(obj)
}

export const getTxInTokenId = (obj: any): any => {
  return blsct.get_tx_in_token_id(obj)
}

export const getTxInOutPoint = (obj: any): any => {
  return blsct.get_tx_in_out_point(obj)
}

export const getTxInStakedCommitment = (obj: any): boolean => {
  return blsct.get_tx_in_staked_commitment(obj)
}

export const getTxInRbf = (obj: any): boolean => {
  return blsct.get_tx_in_rbf(obj)
}

// tx out
export const buildTxOut = (
  subAddr: any,
  amount: number,
  memo: string,
  tokenId: any,
  outputType: TxOutputType,
  minStake: number,
): any => {
  let blsctOutputType
  switch (outputType) {
    case TxOutputType.Normal:
      blsctOutputType = blsct.Normal
      break

    case TxOutputType.StakedCommitment:
      blsctOutputType = blsct.StakedCommitment
      break

    default:
      throw new Error(`Unknown output type: ${outputType}`)
  }

  return blsct.build_tx_out(
    subAddr,
    amount,
    memo,
    tokenId,
    blsctOutputType,
    minStake,
  )
}

export const getTxOutDestination = (obj: any): any => {
  return blsct.get_tx_out_destination(obj)
}

export const getTxOutAmount = (obj: any): number => {
  return blsct.get_tx_out_amount(obj)
}

export const getTxOutMemo = (obj: any): string => {
  return blsct.get_tx_out_memo(obj)
}

export const getTxOutTokenId = (obj: any): any => {
  return blsct.get_tx_out_token_id(obj)
}

export const getTxOutOutputType = (obj: any): TxOutputType => {
  const x = blsct.get_tx_out_output_type(obj)

  switch(x) {
    case blsct.Normal:
      return TxOutputType.Normal

    case blsct.StakedCommitment:
      return TxOutputType.StakedCommitment

    default:
      throw new Error(`Unknown TxOutputType ${x}`)
  }
}

export const getTxOutMinStake = (obj: any): number => {
  return blsct.get_tx_out_min_stake(obj)
}

// typecast
export const asString = (obj: string): any => {
  return blsct.as_string(obj)
}
export const castToCTxIn = (obj: any): any => {
  return blsct.cast_to_ctx_in(obj)
}
export const castToCTxOut = (obj: any): any => {
  return blsct.cast_to_ctx_out(obj)
}
export const castToDpk = (obj: any): any => {
  return blsct.cast_to_dpk(obj)
}
export const castToKeyId = (obj: any): any => {
  return blsct.cast_to_key_id(obj)
}
export const castToOutPoint = (obj: any): any => {
  return blsct.cast_to_out_point(obj)
}
export const castToPoint = (obj: any): any => {
  return blsct.cast_to_point(obj)
}
export const castToPubKey = (obj: any): any => {
  return blsct.cast_to_pub_key(obj)
}
export const castToRangeProof = (obj: any): any => {
  return blsct.cast_to_range_proof(obj)
}
export const castToScalar = (obj: any): any => {
  return blsct.cast_to_scalar(obj)
}
export const castToScript = (obj: any): any => {
  return blsct.cast_to_script(obj)
}
export const castToSignature = (obj: any): any => {
  return blsct.cast_to_signature(obj)
}
export const castToSubAddr = (obj: any): any => {
  return blsct.cast_to_sub_addr(obj)
}
export const castToSubAddrId = (obj: any): any => {
  return blsct.cast_to_sub_addr_id(obj)
}
export const castToTokenId = (obj: any): any => {
  return blsct.cast_to_token_id(obj)
}
export const castToTxIn = (obj: any): any => {
  return blsct.cast_to_tx_in(obj)
}
export const castToTxOut = (obj: any): any => {
  return blsct.cast_to_tx_out(obj)
}
export const castToUint8_tPtr = (obj: any): any => {
  return blsct.cast_to_uint8_t_ptr(obj)
}

// view tag
export const calcViewTag = (
  blindingPubKey: any,
  viewKey: any
): any => {
  return blsct.calc_view_tag(blindingPubKey, viewKey)
}

