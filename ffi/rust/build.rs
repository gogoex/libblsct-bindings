use std::env;
use std::path::PathBuf;

fn main() {
    let repo_root = &PathBuf::from("../..");
    let src_dir = &repo_root.join("src");
    let include_dir = &repo_root.join("include");
    let out_dir = &PathBuf::from(env::var("OUT_DIR").unwrap());
    let bls_dir = &src_dir.join("bls");
    let mcl_dir = &bls_dir.join("mcl");
    let bls_lib_dir = bls_dir.join("lib");
    let mcl_lib_dir = mcl_dir.join("lib");

    // -L
    println!("cargo:rustc-link-search={}", out_dir.to_str().unwrap());
    println!("cargo:rustc-link-search={}", src_dir.to_str().unwrap());
    println!("cargo:rustc-link-search={}", bls_lib_dir.to_str().unwrap());
    println!("cargo:rustc-link-search={}", mcl_lib_dir.to_str().unwrap());

    // -l
    println!("cargo:rustc-link-lib=blsct");
    println!("cargo:rustc-link-lib=bls384_256");
    println!("cargo:rustc-link-lib=mcl");

    // -rpath; $ORIGIN expands to the path to the executable
    println!("cargo:rustc-link-arg=-Wl,-rpath=$ORIGIN/../../../../src/bls/lib");
    println!("cargo:rustc-link-arg=-Wl,-rpath=$ORIGIN/../../../../src/bls/mcl/lib");

    println!("cargo:rerun-if-changed={}/lib.cpp", src_dir.to_str().unwrap());
    println!("cargo:rerun-if-changed={}/lib.h", include_dir.to_str().unwrap());

    let blsctlib = "libblsct.so";
    if !std::process::Command::new("g++")
        //.arg("-Wl,-rpath,/foo")
        .arg("-fPIC")
        .arg("-shared")
        .arg("-I").arg(src_dir.join("bls").join("include"))
        .arg("-I").arg(src_dir.join("bls").join("mcl").join("include"))
        .arg("-I").arg(repo_root)
        .arg("-I").arg(repo_root.join("include"))
        .arg(src_dir.join("lib.cpp"))
        .arg("-o").arg(out_dir.join(blsctlib))
        .output()
        .expect("Failed to spawn `g++`")
        .status
        .success()
    {
        panic!("Failed to build {}", blsctlib);
    }

    let bindings = bindgen::Builder::default()
        .header(include_dir.join("lib.h").to_str().unwrap())
        .parse_callbacks(Box::new(bindgen::CargoCallbacks))
        .generate()
        .expect("Failed to generate bindings");

    bindings
        .write_to_file(out_dir.join("bindings.rs"))
        .expect("Failed to generate bindings");
}