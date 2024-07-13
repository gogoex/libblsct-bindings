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

pushd ./navio.core

./autogen.sh

if [ "$os" == 'linux' ]; then
  arch=$(uname -m)
  DEPENDS_OPT=
  if [ "$arch" == 'x86_64' ]; then
    depends_dir=$(find ./depends -type d -name 'x86_64*' -maxdepth 1 | head -n 1)
    DEPENDS_OPT="--prefix=$(pwd)/${depends_dir}"
  fi
  ./configure --enable-build-libblsct-only $DEPENDS_OPT

elif [ "$os" == 'macos' ]; then
  pushd depends
  make -j${num_cores}
  popd
  depends_dir=$(find ./depends -type d -name 'aarch64*' -maxdepth 1 | head -n 1)
  ./configure --prefix=$(pwd)/${depends_dir} --enable-build-libblsct-only
else

  exit 0
fi

make clean
make -j${num_cores}

popd

if [ ! -d ./lib ]; then
  mkdir ./lib
fi

./script/deploy-libblsct.sh
