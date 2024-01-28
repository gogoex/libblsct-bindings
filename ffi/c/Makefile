CC=g++
CFLAGS=-I../../include
LDFLAGS=-L../../lib -L../../../navcoin/src -lblsct -lmcl -lbls384_256

test: test.o
	$(CC) -o test test.o $(CFLAGS) $(LDFLAGS)

test.o: test.c
	$(CC) -c test.c $(CFLAGS)

clean:
	rm -f test test.o

.PHONY: clean
