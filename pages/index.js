import React, { Component } from "react";
import factory from "../ethereum/factory"; //getting out instance of factory to run in front-end
import { Link } from "../routes";
import campaign from "../ethereum/campaign";

class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaignsList = await factory.methods.getDeployedCampaigns().call();

    for (let camp in campaignsList) {
      const newCampaign = campaign(campaignsList[camp]);
      
    }
    return { campaignsList };
  }

  render() {
    return <h1>Welcome to the Home page</h1>;
  }
}

export default CampaignIndex;
