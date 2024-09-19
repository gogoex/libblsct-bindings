lib := ../../../lib
swig := ../../swig/bin/swig
module := blsct
interface := ./$(module).i
wrap := $(module)_wrap.cxx

./build/Release/blsct.node: $(wrap)
	node-gyp configure && node-gyp build --silly 

$(wrap): $(interface)
	$(swig) -c++ -javascript -node $(interface)

run:
	npm run build && cd build && LD_LIBRARY_PATH=$(lib) node ../test.js

clean:
	rm -f $(wrap)
	rm -rf build

.PHONY: clean run
