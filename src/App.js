import { Provider } from "@project-serum/anchor";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "./App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import AuthenticatedContent from "./components/AuthenticatedContent";
import NotAuthenticatedContent from "./components/NotAuthenticatedContent";

// Constants
const TWITTER_HANDLE = "YBK_FireLights";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

// hardcoded network here ! to change for more dynamic program.
const network = clusterApiUrl("devnet");

const opts = {
  preflightCommitment: "processed",
};

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet is found");
          const response = await solana.connect({ onlyIfTrusted: true });
          if (response && response.publicKey) {
            setWalletAddress(response.publicKey.toString());
          }
          console.log(`Connected to ${response.publicKey.toString()}`);
        }
      } else {
        alert("Solana object not found ! Get a phantom wallet !");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
    if (solana) {
      const response = await solana.connect();
      setWalletAddress(response.publicKey.toString());
    }
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="App">
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse with{" "}
            <span className="solana-title">Solana</span>✨
          </p>
          {walletAddress ? (
            <AuthenticatedContent
              walletAddress={walletAddress}
              getProvider={getProvider}
            />
          ) : (
            <NotAuthenticatedContent connectWallet={connectWallet} />
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
      <ToastContainer autoClose={1000} theme="dark" />
    </div>
  );
};

export default App;
