const anchor = require("@project-serum/anchor");

const { SystemProgram } = anchor.web3;

const main = async () => {
  console.log("Starting tests ....");

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Myepicproject;
  const baseAccount = anchor.web3.Keypair.generate();

  let tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });
  console.log(`Your transaction signature is ${tx}`);

  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log("👀 GIF Count", account.totalGifs.toString());

  await program.rpc.addGif("NEW_GIF_LINK", {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log("👀 GIF Count", account.totalGifs.toString());
  console.log("👀 GIF List", account.gifList);

  console.log("Getting the Gift Id");
  const gif_id = account.gifList[0].gifId;
  console.log("Newly created gif , gif_id: ", gif_id);

  console.log("Adding votes");

  console.log("Up voting the gif ", gif_id);
  await program.rpc.upVote(gif_id, {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);

  console.log("Upvoted gif count", account.votes.length, account.votes[0]);

  console.log("Down voting the gif ", gif_id);

  await program.rpc.downVote(gif_id, {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log("Downvoted gif count", account.votes.length, account.votes[0]);

  console.log("up voting the gif ", gif_id);

  await program.rpc.upVote(gif_id, {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);

  console.log("Upvoted gif count", account.votes.length, account.votes[0]);

  console.log("Creating a new gif and downvoting it");

  await program.rpc.addGif("GIF_LINK_2", {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log("👀 GIF Count", account.totalGifs.toString(), account.gifList);

  console.log("downvoting again but directly this time");

  await program.rpc.downVote(account.gifList[1].gifId, {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log("Downvoted gif count", account.votes.length, account.votes[1]);

  console.log("🎉 Tests completed successfully 🎉");
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error("Error :", error);
    process.exit(1);
  }
};

runMain();
