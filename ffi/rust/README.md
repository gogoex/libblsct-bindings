## Building & Running
```
$ LD_LIBRARY_PATH=../../src/bls/mcl/lib cargo run
```

## TODO
- fix the problem of rpath for mcl lib is not used to load `libmcl.so` and unneccesitate `LD_LIBRARY_PATH`
