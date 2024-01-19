swig := ../swig/swig
cflags := $(shell python3-config --cflags)
ldflags := $(shell python3-config --ldflags --embed)
src := ../../src
bls := $(src)/bls
mcl := $(bls)/mcl
config := ../..
include := -I$(bls)/include -I$(mcl)/include -I$(config) -I../../include
module := blsct
wrap := $(module)_wrap
intf := $(module).i
module_so := _$(module).so

$(module_so): lib.o $(wrap).o
	g++ -Wl,--no-undefined --shared lib.o $(wrap).o \
	-L$(bls)/lib -lbls384_256 -L$(mcl)/lib -lmcl $(ldflags) -o $(module_so)

lib.o: $(wrap).cxx $(module).py
	g++ -c -fpic $(src)/lib.cpp $(cflags) $(include)

$(wrap).o: $(wrap).cxx $(module).py
	g++ -c -fpic $(wrap).cxx $(cflags) $(include)

$(wrap).cxx: $(intf)
	$(swig) -python -c++ $(intf)

run:
	LD_LIBRARY_PATH=$(bls)/lib:$(mcl)/lib python3 test.py

clean:
	rm -f *.o
	rm -f $(module_so)
	rm -f $(module).py
	rm -f $(wrap).*
	rm -rf __pycache__

.PHONY: clean run
