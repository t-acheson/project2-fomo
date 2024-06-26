package main

import (
	"testing"
)

func test() string {
	return "Go is working!"
}

func TestGo(t *testing.T) {
	if test() != "Go is working!" {
		t.Error("Test failed")
	}
}