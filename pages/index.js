import React, { Component } from "react";
import factory from "../ethereum/factory"; //getting out instance of factory to run in front-end
import { Link } from "../routes";
import campaign from "../ethereum/campaign";
import Layout from "../components/Layout";

class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaignsList = await factory.methods.getDeployedCampaigns().call();
    let result = [];

    for (let i = 0; i < campaignsList.length; i++) {
      const newCampaign = campaign(campaignsList[i]);

      if (!(await newCampaign.methods.status().call())) {
        const ownerAddress = await newCampaign.methods.owner().call();
        const campaign_name = await newCampaign.methods.campaign_Name().call();
        result.push({
          owner: ownerAddress,
          campaign_name,
          address: campaignsList[i],
        });
      }
      //this will make sure only the incomplete campaigns are retrieved
    }
    return { result };
  }

  constructor(props) {
    super(props);

    this.state = { campaigns: this.props.result };
  }

  render() {
    // console.log("******************************");
    return (
      <Layout>
        <h1>All Active Campaigns</h1>
        <Link route="/campaigns/new">
          <button type="button" class="btn btn-success">
            <a>Create Campaign</a>
          </button>
        </Link>
        <div className="container-fluid">
          {this.state.campaigns.map((campaign, index) => {
            return (
              <div className="card mt-2 mb-2">
                <div className="card-header">{campaign.address}</div>
                <div className="card-body">
                  <h5 className="card-title">{campaign.campaign_name}</h5>
                  <p className="card-text">Owner ({campaign.owner})</p>
                  <Link route={`/campaigns/${campaign.address}`}>
                    <a className="btn btn-primary">Visit Campaign</a>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;

//! I want owner , campaign_name ,
/**
 * 
 * 
              {/* <Link route={`/campaigns/${campaign.address}`}>
                <a key={index}>
                  <li key={index}>
                    <h2>Following are the campaign details</h2>
                    <ul>
                      <li>Campaign Address: {campaign.address}</li>
                      <li>Campaign Owner: {campaign.owner}</li>
                      <li>Campaign Name: {campaign.campaign_name}</li>
                    </ul>
                  </li>
                </a>
              </Link> }
 */
