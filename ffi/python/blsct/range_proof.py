from __future__ import annotations
from . import blsct
from .amount_recovery_res import AmountRecoveryRes
from .managed_obj import ManagedObj
from .point import Point
from .scalar import Scalar
from .serializable import Serializable
from .token_id import TokenId
from typing import Any, Optional, override, Self, Type, TYPE_CHECKING

if TYPE_CHECKING:
  from .range_proof import RangeProof
  from .amount_recovery_req import AmountRecoveryReq

class RangeProof(ManagedObj, Serializable):
  """
  Represents a (possibly aggregated) range proof for one or more confidential transaction amounts.

  >>> from blsct import AmountRecoveryReq, AmountRecoveryRes, Point, RangeProof, TokenId
  >>> nonce = Point()
  >>> token_id = TokenId()
  >>> rp = RangeProof.build([456], nonce, 'navcoin', token_id)
  >>> RangeProof.verify_proofs([rp])
  True
  >>> req = AmountRecoveryReq(rp, nonce)
  >>> res = RangeProof.recover_amounts([req])
  0: AmtRecoveryRes(is_succ=True, amount=456, message='navcoin')
  """
  def set_size(self, obj_size: int):
    """Set the size of the range proof object."""
    self.obj_size = obj_size

  def get_size(self) -> int:
    """Get the size of the range proof object."""
    return self.obj_size

  @classmethod
  def build(
    cls: Type[Self],
    amounts: list[int],
    nonce: Point,
    message: str,
    token_id: Optional[TokenId] = None,
  ) -> Self:
    """Build a range proof from a list of amounts, nonce, message and optional token ID."""
    vec = blsct.create_uint64_vec()
    for amount in amounts:
      blsct.add_to_uint64_vec(vec, amount)

    if token_id is None:
      token_id = TokenId()
    
    rv = blsct.build_range_proof(
      vec,
      nonce.value(),
      message,
      token_id.value(),
    )
    blsct.free_uint64_vec(vec)

    rv_result = int(rv.result)

    if rv_result != 0:
      blsct.free_obj(rv)
      raise RuntimeError(f"Building range proof failed. Error code = {rv_result}")

    rp = cls(rv.value)
    rp.set_size(rv.value_size)
    blsct.free_obj(rv)
 
    return rp

  @staticmethod
  def verify_proofs(proofs: list["RangeProof"]) -> bool:
    """Verify a list of range proofs."""
    vec = blsct.create_range_proof_vec()
    for proof in proofs:
      blsct.add_range_proof_to_vec(vec, proof.obj_size, proof.value())
    
    rv = blsct.verify_range_proofs(vec)
    rv_result = int(rv.result)

    if rv_result != 0:
      blsct.free_obj(rv)
      raise RuntimeError(f"Verifying range proofs failed. Error code = {rv_result}")

    blsct.free_range_proof_vec(vec)

    return rv.value != 0

  @staticmethod
  def recover_amounts(reqs: list[AmountRecoveryReq]) -> list[AmountRecoveryRes]:
    """
    Recover the amount from each given single-amount range proof. The results may include failures.
    """
    req_vec = blsct.create_amount_recovery_req_vec()

    for req in reqs:
      blsct_req = blsct.gen_amount_recovery_req(
        req.range_proof.value(),
        req.range_proof.get_size(),
        req.nonce.value(),
      )
      blsct.add_to_amount_recovery_req_vec(req_vec, blsct_req)

    rv = blsct.recover_amount(req_vec)
    blsct.free_amount_recovery_req_vec(req_vec)

    rv_result = int(rv.result)
    if rv_result != 0:
      blsct.free_amounts_ret_val(rv)
      raise RuntimeError(f"Recovering amount failed. Error code = {rv_result}")
 
    res = []
    size = blsct.get_amount_recovery_result_size(rv.value)

    for i in range(size):
      is_succ = blsct.get_amount_recovery_result_is_succ(rv.value, i)
      amount = blsct.get_amount_recovery_result_amount(rv.value, i)
      message = blsct.get_amount_recovery_result_msg(rv.value, i)
      x = AmountRecoveryRes(
        is_succ, 
        amount,
        message,
      )
      print(f"{i}: {x}")
      res.append(x)
    
    blsct.free_amounts_ret_val(rv)
    return res

  def get_A(self) -> Point:
    """Get the range proof element A."""
    obj = blsct.get_range_proof_A(self.value())
    return Point.from_obj(obj)

  def get_A_wip(self) -> Point:
    """Get the range proof element A_wip."""
    obj = blsct.get_range_proof_A_wip(self.value())
    return Point.from_obj(obj)

  def get_B(self) -> Point:
    """Get the range proof element B."""
    obj = blsct.get_range_proof_B(self.value())
    return Point(obj)

  def get_r_prime(self) -> Scalar:
    """Get the range proof element r_prime."""
    obj = blsct.get_range_proof_r_prime(self.value())
    return Scalar(obj)

  def get_s_prime(self) -> Scalar:
    """Get the range proof element s_prime."""
    obj = blsct.get_range_proof_s_prime(self.value())
    return Scalar(obj)

  def get_delta_prime(self) -> Scalar:
    """Get the range proof element delta_prime."""
    obj = blsct.get_range_proof_delta_prime(self.value())
    return Scalar(obj)

  def get_alpha_hat(self) -> Scalar:
    """Get the range proof element alpha hat."""
    obj = blsct.get_range_proof_alpha_hat(self.value())
    return Scalar(obj)

  def get_tau_x(self) -> Scalar:
    """Get the range proof element tau_x."""
    obj = blsct.get_range_proof_tau_x(self.value())
    return Scalar(obj)

  @override
  def value(self) -> Any:
    return blsct.cast_to_range_proof(self.obj)

  def serialize(self) -> str:
    """Serialize the RangeProof to a hexadecimal string"""
    return blsct.serialize_range_proof(self.value(), self.obj_size)

  @classmethod
  @override
  def deserialize(cls, hex: str) -> Self:
    """Deserialize the RangeProof from a hexadecimal string"""
    assert len(hex) % 2 == 0, "Expected the hex to have an even length"
    obj_size = len(hex) // 2
    return blsct.deserialize_range_proof(hex, obj_size);
