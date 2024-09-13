.PHONY: build run test clean fmt fix clippy

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

fix:
	cargo fix --all

clippy:
	cargo clippy --all --all-features --fix
