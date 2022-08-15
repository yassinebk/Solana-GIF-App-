import { Program, web3 } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import React, { useState, useEffect } from "react";
import idl from "../myepicproject.json";
import GifCard from "./GifCard";

import kp from "../keypair.json";

const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);

const programID = new PublicKey(idl.metadata.address);
const { SystemProgram } = web3;

const AuthenticatedContent = ({ walletAddress, provider }) => {
  const [gifList, setGifList] = useState(null);
  const [votes, setVotes] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const onInputChange = ({ target }) => {
    setInputValue(target.value);
  };

  const getBaseAccountData = async () => {
    try {
      console.log("here");
      const program = new Program(idl, programID, provider);
      console.log(program);
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );
      console.log("here", account);

      console.log("Got the account ", account);
      // setGifList(account.gifList);
      // setVotes(account.votes);
    } catch (error) {
      console.log("error", error.message);
    }
  };

  const sendGif = async ({ baseAccount, idl }) => {
    if (inputValue.length > 0) {
      console.log("Gif link:", inputValue);
      try {
        const program = new Program(idl, programID, provider);
        await program.rpc.addGif(inputValue, {
          accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
          },
        });
        await getBaseAccountData();
        setInputValue("");
      } catch (error) {
        console.error("Error: ", error);
      }
    } else console.log("Empty input.");
  };

  const createGifAccount = async () => {
    try {
      console.log(provider);
      const program = new Program(idl, programID, provider);
      await program.rpc.startStuffOff({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      });

      console.log(
        "Created a new BaseAccount w/ address:",
        baseAccount.publicKey.toString()
      );
      await getBaseAccountData();
    } catch (error) {
      console.log("Error creating basic account", error);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      getBaseAccountData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  if (gifList === null)
    return (
      <div className="connected-container">
        <button
          className="cta-button submit-gif-button"
          onClick={createGifAccount}
        >
          Do One-Time Initialization For GIF Program Account
        </button>
      </div>
    );

  return (
    <div className="connected-container">
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await sendGif();
        }}
      >
        <input
          type="text"
          placeholder="Enter GIF link !"
          value={inputValue}
          onChange={onInputChange}
        />{" "}
        <button type="submit" className="cta-button submit-gif-button">
          Submit
        </button>
      </form>
      <div className="gif-grid">
        {gifList.map((item, index) => (
          <GifCard
            gif={item}
            votes={votes.filter((v) => v.gifId === item.gifId)}
          />
        ))}
      </div>
    </div>
  );
};

export default AuthenticatedContent;
