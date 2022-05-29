import React, { Component } from "react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";
import Layout from "../../components/Layout";

// const CampaignNew = (props) => {
//   return <h1>This is the New Campaigns Form Page</h1>;
// };

class CampaignNew extends Component {
  constructor(props) {
    super(props);

    this.state = { name: "" };
  }

  nameChangeHandler = (evt) => {
    this.setState({ ...this.state, name: evt.target.value });
  };

  submitHandler = async (evt) => {
    evt.preventDefault();
    const account = (await web3.eth.getAccounts())[0];
    await factory.methods.createCampaign(this.state.name).send({
      from: account,
      gas: "10000000",
    });
    this.setState({ name: "" });
    Router.pushRoute("/");
  };

  render() {
    return (
      <Layout>
        <h1>New Campaign Form</h1>
        <form className="mt-5" onSubmit={this.submitHandler}>
          <div className="mb-3">
            <label for="name" className="form-label">
              Campaign Name
            </label>
            <input
              value={this.state.name}
              onChange={this.nameChangeHandler}
              type="text"
              className="form-control"
              id="name"
              aria-describedby="Name Enter"
            />
            <div id="emailHelp" className="form-text">
              This the name of your donation Campaign
            </div>
          </div>
          <button type="submit" className="btn btn-success">
            Submit
          </button>
        </form>
      </Layout>
    );
  }
}

export default CampaignNew;