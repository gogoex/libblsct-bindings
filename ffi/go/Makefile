swig := ../swig/swig
module := blsct
module_wrap := $(module)/$(module)_wrap.cxx
module_go := $(module)/$(module).go
module_main := $(module)/lib.cxx
exe := main
interface := $(module)-go.i
libdir := ../..

$(exe): $(module_wrap) $(module_go) $(module_main)
	go build -x $(exe).go

$(module_wrap): $(interface)
	$(swig) -go -cgo -c++ -outdir $(module) -o $@ $<

$(module_main):
	cd $(module)
	ln -s ../../../src/lib.cpp $@

run:
	LD_LIBRARY_PATH=$(libdir)/src/bls/lib:$(libdir)/src/bls/mcl/lib ./$(exe)

clean:
	rm -f $(exe)
	rm -f $(module_wrap)
	rm -f $(module_go)
	rm -f $(module_main)

.PHONY: clean run
