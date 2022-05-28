require("dotenv").config(); //this will load the environment variables

const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignList.json");

const provider = new HDWalletProvider(
  process.env.ACCOUNT_SECRET,
  process.env.ETH_NODE_LINK
); //this will create a provider instance

const web3 = new Web3(provider);

const deploy = async () => {
  const account = (await web3.eth.getAccounts())[0]; //we'll use the first account to deploy

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode, arguments: [] })
    .send({ gas: "10000000", from: account });

  console.log("Successfully deployed to - ", result.options.address);

  provider.engine.stop();
  //terminate the provider engine
};

deploy();
//this will deploy the contract using author's account on desired etherium network
