const fs = require("fs");
const {web3} = require("@project-serum/anchor");

const account = web3.Keypair.generate();

fs.writeFileSync("./src/keypair.json", JSON.stringify(account));

console.log("generated base account", account);
