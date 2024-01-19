## Note
- This sample is using go module which has been initialized by:
  ```bash
  $ go mod init blsct-test
  ```

- `blsct` module directory is created as a sub-directory of the main module

- `blsct` module can be imported from the main module by:
  ```golang
  import (
    "blsct-test/blsct"
  )
  ```

- Golang compiler expects `src/lib.cpp` to be directly under `blsct` module dir with `.cxx` suffix

## Building
```bash
$ make
```

## Running
```bash
$ make run
```
