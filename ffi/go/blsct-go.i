%module blsct

%insert(cgo_comment) %{
#cgo CXXFLAGS: -I../../../src/bls/include -I../../../src/bls/mcl/include -I../../../include -I../../..
#cgo LDFLAGS: -L../../../src/bls/lib -L../../../src/bls/mcl/lib -lmcl -lbls384_256
%}

%{
    extern void BlsInit();
    extern int TestAddition();
%}

extern void BlsInit();
extern int TestAddition();
