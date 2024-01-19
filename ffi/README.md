## Preparing local `swig`
`go`, `js` and `python` samples in this directory expect `swig` to be installed under `./swig` directory.

To make `swig` available there, do the follwoing:

### Updating `swig` repository

```bash
$ git submodule update --remote swig
```

### Building and installing `swig`

```bash
$ cd swig
$ ./autogen.sh
$ ./configure --prefix=`pwd` # setting prefix to install config files under swig dir
$ make
$ make install # install swig config files locally under swig dir
```
