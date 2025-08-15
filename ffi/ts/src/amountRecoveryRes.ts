/** The result of recovering a single amount from a non-aggregated range proof.
 * Refer to `RangeProof` for a usage example.
 */
export class AmountRecoveryRes {
  isSucc: boolean
  amount: number
  msg: string

  /** Constructs a new `AmountRecoveryRes` instance.
   * @param isSucc - Indicates whether the recovery was successful.
   * @param amount - The recovered amount.
   * @param msg - The recovered message.
   */
  constructor(
    isSucc: boolean,
    amount: number,
    msg: string,
  ) {
    this.isSucc = isSucc
    this.amount = amount
    this.msg = msg
  }

  /** Returns a string representation of the `AmountRecoveryRes`.
   * @returns a string representation of the `AmountRecoveryRes`.
   */
  toString(): string {
    return `${this.constructor.name}(${this.isSucc}, ${this.amount}, ${this.msg})`
  }

  serialize(): string {
    const jsonStr = JSON.stringify(this)
    const buf = Buffer.from(jsonStr, 'utf-8')
    return buf.toString('hex')
  }

  /** Deserializes a hexadecimal string into an `AmountRecoveryRes` instance.
   * @param hex - The hexadecimal string to deserialize.
   * @returns An instance of `AmountRecoveryRes`.
   */
  deserialize(hex: string): AmountRecoveryRes {
    let obj: any
    try {
      const json = Buffer.from(hex, 'hex').toString('utf8')
      obj = JSON.parse(json)
    } catch (e) {
      throw new Error(`Failed to deserialize to object: ${JSON.stringify(e)}`)
    }

    if (
      typeof obj !== 'object' ||
      typeof obj.isSucc !== 'boolean' ||
      typeof obj.amount !== 'number' ||
      typeof obj.msg !== 'string'
    ) {
      throw new Error(`Deserialize object is not AmountRecoveryRes: ${hex}`)
    }

    return new AmountRecoveryRes(
      obj.isSucc,
      obj.amount,
      obj.msg,
    )
  }
}

