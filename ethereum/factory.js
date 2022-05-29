//the process.env files will be loaded from .env.local
// require("dotenv").config();

import web3 from "./web3";
import CampaignList from "./build/CampaignList.json";

// console.log(process.env.FACTORY_ADDR);

const instance = new web3.eth.Contract(
  JSON.parse(CampaignList.interface),
  process.env.FACTORY_ADDR
);

//creating the instance of campaign list contract to send to front-end

export default instance;
