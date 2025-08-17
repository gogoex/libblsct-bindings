import {
  buildTxIn,
  castToTxIn,
  castToUint8_tPtr,
  freeObj,
  getTxInAmount,
  getTxInGamma,
  getTxInSpendingKey,
  getTxInTokenId,
  getTxInOutPoint,
  getTxInStakedCommitment,
  getTxInRbf,
  hexToMallocedBuf,
  toHex,
} from './blsct'

import { ManagedObj } from './managedObj'
import { SpendingKey } from './keys/childKeyDesc/txKeyDesc/spendingKey'
import { TokenId } from './tokenId'
import { OutPoint } from './outPoint'

/** Represents a transaction input used to construct CTxIn in a confidential transaction.
 *
 * Examples:
 * ```ts
 * const { Scalar, ChildKey, OutPoint, SpendingKey, TokenId, CTxId, TxIn, CTX_ID_SIZE } = require('navio-blsct')
 * const { randomBytes } = require('crypto')
 * const cTxIdHex = randomBytes(CTX_ID_SIZE).toString('hex')
 * const cTxId = CTxId.deserialize(cTxIdHex)
 * const amount = 123
 * const gamma = 100
 * const s = Scalar.random()
 * const ck = new ChildKey(s)
 * const txk = ck.toTxKey()
 * const spendingKey = txk.toSpendingKey()
 * const tokenId = TokenId.default()
 * const outPoint = OutPoint.generate(cTxId, 0)
 * const txIn = TxIn.generate(amount, gamma, spendingKey, tokenId, outPoint)
 * txIn.getAmount() // 123
 * txIn.getGamma() // 100
 * txIn.getSpendingKey()
 * txIn.getTokenId()
 * txIn.getOutPoint()
 * txIn.getStakedCommitment() // false
 * txIn.getRbf() // false
 * const ser = txIn.serialize()
 * const deser = TxIn.deserialize(ser)
 * ser === deser.serialize() // true
 * ```
 */
export class TxIn extends ManagedObj {
  constructor(obj: any) {
    super(obj)
  }

  /** Constructs a new `TxIn` instance.
   * @param amount - The amount of the input.
   * @param gamma - The gamma of the input.
   * @param spendingKey - The spending key associated with the input.
   * @param tokenId - The token ID associated with the input.
   * @param outPoint - The outpoint associated with the input.
   * @param isStakedCommitment - Indicates if the commitment is staked (default: false).
   * @param isRbf - Indicates if the transaction is replaceable by fee (default: false).
   * @returns A new `TxIn` instance.
   */
  static generate(
    amount: number,
    gamma: number,
    spendingKey: SpendingKey,
    tokenId: TokenId,
    outPoint: OutPoint,
    isStakedCommitment: boolean = false,
    isRbf: boolean = false,
  ): TxIn {
    const rv = buildTxIn(
      amount,
      gamma,
      spendingKey.value(),
      tokenId.value(),
      outPoint.value(),
      isStakedCommitment,
      isRbf
    )
    if (rv.result !== 0) {
      const msg = `Failed to build TxIn. Error code = ${rv.result}`
      freeObj(rv)
      throw new Error(msg)
    }
    const x = new TxIn(rv.value)
    x.objSize = rv.value_size
    freeObj(rv)

    return x
  }

  override value(): any {
    return castToTxIn(this.obj)
  }

  /** Returns the amount of the transaction input.
   * @returns The amount of the transaction input.
   */
  getAmount(): number {
    return getTxInAmount(this.value())
  }

  /** Returns the gamma of the transaction input.
   * @returns The gamma of the transaction input.
   */
  getGamma(): number {
    return getTxInGamma(this.value())
  }

  /** Returns the spending key associated with the transaction input.
   * @returns The spending key associated with the transaction input.
   */
  getSpendingKey(): SpendingKey {
    const obj = getTxInSpendingKey(this.value())
    return SpendingKey.fromObj(obj)
  }

  /** Returns the token ID associated with the transaction input.
   * @returns The token ID associated with the transaction input.
   */
  getTokenId(): TokenId {
    const obj = getTxInTokenId(this.value())
    return TokenId.fromObj(obj)
  }

  /** Returns the outpoint associated with the transaction input.
   * @returns The outpoint associated with the transaction input.
   */
  getOutPoint(): OutPoint {
    const obj = getTxInOutPoint(this.value())
    return OutPoint.fromObj(obj)
  }

  /** Returns if the transaction input is a staked commitment.
   * @returns `true` if the transaction input is a staked commitment, otherwise `false`.
   */
  getStakedCommitment(): boolean {
    return getTxInStakedCommitment(this.value())
  }

  /** Returns if the transaction input is replaceable by fee (RBF).
   * @returns `true` if the transaction input is RBF, otherwise `false`.
   */
  getRbf(): boolean {
    return getTxInRbf(this.value())
  }

  /** Returns a deep copy of the instance.
   * @returns A new `TxIn` instance that is a deep copy of this instance.
   */
  clone(): TxIn {
    const ser = this.serialize()
    return TxIn.deserialize(ser)
  }

  override serialize(): string {
    const buf = castToUint8_tPtr(this.value())
    return toHex(buf, this.size())
  }

  /** Deserializes a hexadecimal string into a `TxIn` instance.
   * @param hex - The hexadecimal string to deserialize.
   * @returns A new `TxIn` instance.
   */
  static deserialize(
    this: new (obj: any) => TxIn,
    hex: string
  ): TxIn {
    if (hex.length % 2 !== 0) {
      hex = `0${hex}`
    }
    const obj = hexToMallocedBuf(hex)
    const x = new TxIn(obj)
    x.objSize = hex.length / 2 
    return x
  }
}

