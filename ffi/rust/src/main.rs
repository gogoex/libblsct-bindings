#![allow(non_snake_case)]

include!(concat!(env!("OUT_DIR"), "/bindings.rs"));

fn main() {
    unsafe {
        BlsInit();
        let res = TestAddition();
        println!("{}", res);
    }
}