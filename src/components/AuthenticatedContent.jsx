import { Program, web3 } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import kp from "../keypair.json";
import idl from "../myepicproject.json";
import GifCard from "./GifCard";

const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
console.log(secret);
const baseAccount = web3.Keypair.fromSecretKey(secret);

const programID = new PublicKey(idl.metadata.address);
const { SystemProgram } = web3;

const AuthenticatedContent = ({ walletAddress, getProvider }) => {
  const [gifList, setGifList] = useState(null);
  const [votes, setVotes] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const onInputChange = ({ target }) => {
    setInputValue(target.value);
  };

  const getBaseAccountData = async () => {
    try {
      console.log("here");
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      console.log(program);
      const account = await toast.promise(
        program.account.baseAccount.fetch(baseAccount.publicKey),

        {
          pending: "Fetching gifs ",
          success: "Have fun  👌",
          error: "Error fetching gifs 🤯",
        }
      );

      console.log("here", account);

      console.log("Got the account ", account);
      setGifList(account.gifList);
      setVotes(account.votes);
    } catch (error) {
      console.log("error", error.message, error);
    }
  };

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log("Gif link:", inputValue);
      try {
        const provider = getProvider();
        const program = new Program(idl, programID, provider);
        await toast.promise(
          program.rpc.addGif(inputValue, {
            accounts: {
              baseAccount: baseAccount.publicKey,
              user: provider.wallet.publicKey,
            },
          }),
          {
            pending: "Adding GIF 🕐 ",
            success: "GIF added  👌",
            error: "Error adding GIF 🤯",
          }
        );
        await getBaseAccountData();
        setInputValue("");
      } catch (error) {
        console.error("Error: ", error.message);
      }
    } else console.log("Empty input.");
  };

  const createGifAccount = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      console.log("program", program);
      await toast.promise(
        program.rpc.startStuffOff({
          accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
          signers: [baseAccount],
        }),
        {
          error: "Error creating account 🤯",
          pending: "Creating account 🕐 ",
          success: "Account created  👌",
        }
      );

      console.log(
        "Created a new BaseAccount w/ address:",
        baseAccount.publicKey.toString()
      );
      await getBaseAccountData();
    } catch (error) {
      console.log("Error creating basic account", error);
    }
  };

  const upvote = async (gifId) => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      await toast.promise(
        program.rpc.upVote(gifId, {
          accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
          },
        }),
        {
          success: "Upvoted 👍 ",
          pending: "Upvoting 🕐",
          error: "Error upvoting 🤯",
        }
      );

      await getBaseAccountData();
    } catch (error) {
      console.log("failure upvoting gif ", " with error: ", error.message);
    }
  };

  const downvote = async (gifId) => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      await toast.promise(
        program.rpc.downvote(gifId, {
          accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
          },
        }),
        {
          success: "Downvoted 👎 ",
          pending: "Upvoting 🕐",
          error: "Error upvoting 🤯",
        }
      );

      await getBaseAccountData();
    } catch (error) {
      console.log(
        "failure downvoting gif ",
        gifId,
        " with error: ",
        error.message
      );
    }
  };

  const removeGif = async (gifId) => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      await toast.promise(
        program.rpc.removeGif(gifId, {
          accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
          },
        }),
        {
          success: "Removed gif 👌",
          pending: "Removing gif 🕐",
          error: "Error removing gif 🤯",
        }
      );

      await getBaseAccountData();
    } catch (error) {
      console.log(
        "failure upvoting gif ",
        gifId,
        " with error: ",
        error.message
      );
    }
  };

  const removeVote = async (gifId) => {
    try {
      const provider = getProvider();
      console.log("removing vote");
      const program = new Program(idl, programID, provider);
      await toast.promise(
        program.rpc.removeVote(gifId, {
          accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
          },
        }),
        {
          success: "Removed vote 👍 ",
          pending: "Removing vote 🕐",
          error: "Error removing vote 🤯",
        }
      );

      await getBaseAccountData();
    } catch (error) {
      console.log(
        "failure upvoting gif ",
        gifId,
        " with error: ",
        error.message
      );
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
        {gifList
          .sort(
            (a, b) =>
              -votes.filter((v) => v.gifId === a.gifId).length +
              votes.filter((v) => v.gifId === b.gifId).length
          )
          .map((item, index) => (
            <GifCard
              isMyGif={item.userAddress.toString() === walletAddress}
              walletAddress={walletAddress}
              upvote={upvote}
              downvote={downvote}
              removeGif={removeGif}
              removeVote={removeVote}
              gif={item}
              key={item.gifId}
              votes={votes ? votes.filter((v) => v.gifId === item.gifId) : []}
            />
          ))}
      </div>
    </div>
  );
};

export default AuthenticatedContent;
