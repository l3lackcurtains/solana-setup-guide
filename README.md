# Solana and Anchor Setup Guide

This guide will help you set up your development environment for building and testing Solana programs using Rust and Anchor.

## Install Rust

First, install Rust, the programming language used for writing Solana programs.

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
rustc --version
```

## Install Solana

Next, install the Solana CLI tools. These tools are essential for interacting with the Solana blockchain.

```bash
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
solana --version
```

Update Solana to the latest version:

```bash
agave-install update
```

For more information, check the [Solana installation guide](https://solana.com/docs/intro/installation).

## Test Solana and Use Localhost Testnet

To test Solana locally, you can use the Solana test validator. Note that this doesn't work in Windows mounted folders.

In a new terminal, run:

```bash
cd ~
solana-test-validator
```

Then, configure Solana to use the localhost testnet:

```bash
solana address
solana account <address from above>
solana config set --url localhost
solana-test-validator
```

## Setup Solana

Generate a new keypair and configure Solana:

```bash
solana-keygen new
solana address
solana config set -ud
solana airdrop 2
solana balance
```

## Install Anchor

Anchor is a framework for Solana's Sealevel runtime providing several developer tools.

Install Anchor CLI:

```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
```

Install missing dependencies:

```bash
sudo apt-get update && sudo apt-get upgrade && sudo apt-get install -y pkg-config build-essential libudev-dev libssl-dev
```

For more information, check the [Anchor installation guide](https://www.anchor-lang.com/docs/installation).

## Create a New Project

Initialize a new Anchor project:

```bash
anchor init solana-app --javascript
```

## Build and Test the Project

Build the project:

```bash
anchor build
```

Run tests:

```bash
anchor test
```

To skip the local validator during tests:

```bash
anchor test --skip-local-validator
```

## Create Dynamically Generated Program ID

Generate a new keypair for your program:

```bash
solana-keygen new -o ./target/deploy/solana_app-keypair.json
solana address -k ./target/deploy/solana_app-keypair.json
```

Replace the program ID in your project:

In `mysolanaapp/src/lib.rs`:

```rust
declare_id!("your-program-id");
```

In `Anchor.toml`:

```toml
[programs.localnet]
mysolanaapp = "your-program-id"
```

## Clean Up

Clean the project:

```bash
cargo clean
```

Remove the target directory if needed.

## Important Notes

- To copy the idl file to the frontend, use:

```bash
node ./copy-idl.js
```

- There are no read operations in Solana programs. To read the contents of a program, request the account, and you can view all of the program's state.
