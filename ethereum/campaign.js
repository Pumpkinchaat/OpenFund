import web3 from "./web3";
import Campaign from "./build/Campaign.json";

const campaign = (campaignAddress) => {
  return new web3.eth.Contract(JSON.parse(Campaign.interface), campaignAddress);
};
//this will make a campaign instance for the front-end to use when the address
//of a preexisting campaign is provided

export default campaign;
