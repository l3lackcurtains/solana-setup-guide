/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import idl from "./utils/idl.json";

const PROGRAM_ID = new PublicKey(idl.address); // Ensure this is the correct address

const getAnchorProgram = (wallet: any, connection: any) => {
  if (!wallet) return null;

  const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());

  const program = new Program(idl, PROGRAM_ID, provider);
  console.log(program);
};

export default function Home() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (wallet.publicKey) {
      connection.getBalance(wallet.publicKey).then((balance) => {
        setBalance(balance / 1e9); // Convert lamports to SOL
      });
    }
  }, [connection]);

  const executeProgramFunction = async () => {
    try {
      const program = getAnchorProgram(wallet, connection);

      if (!program) {
        console.error("Wallet not connected or program initialization failed.");
        return;
      }

      const [userAccount, _] = await PublicKey.findProgramAddress([wallet.publicKey.toBuffer()], PROGRAM_ID);

      const tx = await program.methods
        .stakeNft()
        .accounts({
          user: wallet.publicKey,
          userAccount,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      console.log("Transaction signature:", tx);
    } catch (error) {
      console.error("Error executing program function:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Solana Wallet Adapter Example</h1>
      {wallet.publicKey ? (
        <div>
          <p className="mb-2">Connected as: {wallet.publicKey.toBase58()}</p>
          <p className="mb-4">Balance: {balance} SOL</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={executeProgramFunction}>
            Execute Program Function
          </button>
          <WalletDisconnectButton />
        </div>
      ) : (
        <WalletMultiButton />
      )}
    </div>
  );
}
