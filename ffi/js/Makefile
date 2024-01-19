mcllib := ../../../src/bls/mcl/lib
swig := ../swig/swig
module := blsct
wrap := $(module)_wrap.cxx
interface := $(module).i

./build/Release/blsct.node: $(wrap)
	node-gyp configure build

$(wrap): $(interface)
	$(swig) -c++ -javascript -node $(interface)

run:
	cd build && LD_LIBRARY_PATH=$(mcllib) node ../test.js

clean:
	rm -f $(wrap)
	rm -rf build

.PHONY: clean run
