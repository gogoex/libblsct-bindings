# libblsct-bindings

## Preparation

### Install libblsct

1. Move to the repository root directory

1. Initialize and update `navcoin` submodule:

   ```bash
   git submodule update --init --recursive
   ```

1. Build `src/libblsct.a`:

   ```bash
   ./build-libblsct.sh
   ```

1. Initialize and update `swig` submodule:

   ```bash
   cd ffi
   git submodule update --init --recursive
   ```

### Install Swig

1. Install `PCRE2` and `bison`

   On Ubuntu:

   ```bash
   sudo apt install libpcre2-dev bison
   ```

   On macOS:

   ```bash
   brew install ...
   ```

1. Build `swig` and install it under `ffi/swig` directoy

   ```bash
   cd swig
   ./autogen.sh
   ./configure --prefix=$(pwd)
   make -j8
   make install
   ```

1. Add locally built `Swig` to the `PATH`

   ```bash
   PATH=$PATH:$(pwd)/bin
   ```

