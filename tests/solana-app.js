const anchor = require("@coral-xyz/anchor");

const assert = require("assert");

describe("solana-app", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaApp;

  let baseAccount = anchor.web3.Keypair.generate();

  console.log(anchor.web3.SystemProgram.programId);

  it("Initializes the account", async () => {
    await program.rpc.initialize({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [baseAccount],
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    assert.ok(account.count.toNumber() === 0);
  });

  it("Increments the count", async () => {
    await program.rpc.increment({
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    assert.ok(account.count.toNumber() === 1);
  });

  it("Increments the count again", async () => {
    await program.rpc.increment({
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    assert.ok(account.count.toNumber() === 2);
  });
});
