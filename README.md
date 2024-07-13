# libblsct-bindings

## Preparation

### Common

1. Move to the repository root directory

1. Create a symbolic link to `navio-core`

   ```bash
   ln -s path/to/navio-core
   ```

1. Initialize and update `swig` submodule:

   ```bash
   git submodule update --init --remote --recursive
   ```

### Install libblsct

1. Build `src/libblsct.a`:

   ```bash
   ./script/build-libblsct.sh
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
   brew install pcre2 
   ```

   and add bison to the path
   ```bash
   export PATH="/opt/homebrew/opt/bison/bin:$PATH"
   ```

1. Build `swig` and install it under `swig` directoy

   ```bash
   ./script/build-swig.sh
   ```

1. Add locally built `Swig` to the `PATH`

   ```bash
   source ./script/activate-swig.sh
   ```

