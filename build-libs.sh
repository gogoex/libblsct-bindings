#!/bin/sh

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

echo "# of cores: ${num_cores}"
echo "os: ${os}"

pushd navcoin
./autogen.sh

if [ "$os" == "linux" ]; then
  ./configure --enable-build-libblsct-only
elif [ "$os" == "macos" ]; then
  pushd depends
  make -j${num_cores}
  popd
  aarch64_dir=$(find ./depends -type d -name "aarch64*" -maxdepth 1 | head -n 1)
  ./configure --prefix=$(pwd)/${aarch64_dir} --enable-build-libblsct-only
else
  exit 0
fi

make -j${num_cores}

popd

cp ./navcoin/src/libblsct.a ./lib
cp ./navcoin/src/bls/lib/libbls384_256.a ./lib
cp ./navcoin/src/bls/mcl/lib/libmcl.a ./lib

