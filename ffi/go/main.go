package main

import (
    "blsct-test/blsct"
    "fmt"
)

func main() {
    blsct.BlsInit();
    res := blsct.TestAddition();
    fmt.Println(res);
}