.PHONY: build run test clean fmt fmt-check deny-check fix clippy

build:
	cargo build --all

release:
	cargo build --release

run:
	cargo run

test:
	cargo test

clean:
	cargo clean

fmt:
	cargo fmt --all

fmt-check:
	cargo fmt --all --check

deny-check:
	cargo deny --all-features check

fix:
	cargo fix --all

clippy:
	cargo clippy --all-targets --all-features -- -D warnings
