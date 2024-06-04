#!/bin/bash

set -e

case "$(uname)" in
Linux*)
  num_cores=$(nproc)
  os=linux
  ;;
Darwin*)
  num_cores=$(sysctl -n hw.physicalcpu)
  os=macos
  ;;
*)
  num_cores=1
  os=others
  ;;
esac

pushd ./swig

./autogen.sh
./configure --prefix=$(pwd)
make -j${num_cores}
make install

popd

