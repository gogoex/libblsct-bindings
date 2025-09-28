use crate::{
  blsct_obj::BlsctObj,
  blsct_serde::BlsctSerde, 
  ffi::{
    BlsctRetVal,
    BlsctTokenId,
    deserialize_token_id,
    gen_default_token_id,
    gen_token_id,
    get_token_id_subid,
    get_token_id_token,
    gen_token_id_with_token_and_subid,
    serialize_token_id,
  },
  macros::{
    impl_clone,
    impl_display,
    impl_from_retval,
    impl_value,
  },
};
use std::ffi::c_char;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, Eq)]
pub struct TokenId {
  obj: BlsctObj<TokenId, BlsctTokenId>,
}

impl_from_retval!(TokenId);
impl_display!(TokenId);
impl_clone!(TokenId);

impl TokenId {
  pub fn default() -> Self {
    let rv = unsafe { gen_default_token_id() };
    BlsctObj::from_retval(rv).unwrap().into()
  }

  pub fn from_token(token: u64) -> Self {
    let rv = unsafe { gen_token_id(token) };
    BlsctObj::from_retval(rv).unwrap().into()
  }

  pub fn from_token_and_subid(token: u64, subid: u64) -> Self {
    let rv = unsafe { gen_token_id_with_token_and_subid(token, subid) };
    BlsctObj::from_retval(rv).unwrap().into()
  }

  pub fn token(&self) -> u64 {
    unsafe { get_token_id_token(self.value()) }
  }

  pub fn subid(&self) -> u64 {
    unsafe { get_token_id_subid(self.value()) }
  }

  impl_value!(TokenId, BlsctTokenId);
}

impl BlsctSerde for TokenId {
  unsafe fn serialize(ptr: *const u8) -> *const i8 {
    serialize_token_id(ptr as *const BlsctTokenId)
  }

  unsafe fn deserialize(hex: *const c_char) -> *mut BlsctRetVal {
    unsafe { deserialize_token_id(hex) }
  }
}

impl From<BlsctObj<TokenId, BlsctTokenId>> for TokenId {
  fn from(obj: BlsctObj<TokenId, BlsctTokenId>) -> TokenId {
    TokenId { obj }
  }
}

impl PartialEq for TokenId {
  fn eq(&self, other: &Self) -> bool {
    self.token() == other.token() && self.subid() == other.subid()
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::initializer::init;

  #[test]
  fn test_default() {
    init();
    let token_id = TokenId::default();
    assert_eq!(token_id.token(), 0);
    assert_eq!(token_id.subid(), u64::MAX); // should be uint64 max
  }

  #[test]
  fn test_from_token() {
    init();
    let token = 123u64;
    let token_id = TokenId::from_token(token);
    assert_eq!(token_id.token(), token);
    assert_eq!(token_id.subid(), u64::MAX); // should be uint64 max
  }

  #[test]
  fn test_from_token_and_subid() {
    init();
    let token = 123u64;
    let subid = 456u64;
    let token_id = TokenId::from_token_and_subid(token, subid);
    assert_eq!(token_id.token(), token);
    assert_eq!(token_id.subid(), subid);
  }

  #[test]
  fn test_deser() {
    init();

    let a = TokenId::from_token_and_subid(123, 456);
    let hex = bincode::serialize(&a).unwrap();
    let b = bincode::deserialize::<TokenId>(&hex).unwrap();
    assert!(a == b);
  }
}

