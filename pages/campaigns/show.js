import React, { Component } from "react";
import web3 from "../../ethereum/web3";
import campaign from "../../ethereum/campaign";
import { Link } from "../../routes";
import { Router } from "../../routes";
import Layout from "../../components/Layout";

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const campaignShow = campaign(props.query.address);

    const res = await campaignShow.methods.summary().call();

    const donorsDetailLength = await campaignShow.methods
      .getDonarDetailsLength()
      .call();

    const requestLength = await campaignShow.methods.getRequestLength().call();

    let donorsDetail = [];
    let requests = [];

    for (let i = 0; i < donorsDetailLength; i++) {
      const detail = await campaignShow.methods.donors_details(i).call();
      donorsDetail.push(detail);
    }

    for (let i = 0; i < requestLength; i++) {
      const request = await campaignShow.methods.request(i).call();
      if (request.status) requests.push(request);
    }

    const totalTransactions = requests.length + donorsDetail.length;

    const campaignDetails = {
      owner: res["0"],
      campaign_Name: res["1"],
      balance: res["2"],
      totalTransactions: totalTransactions,
      address: props.query.address,
    };

    return { campaignDetails };
  }

  constructor(props) {
    super(props);

    this.state = { contribution: "", name: "", message: "" };
  }

  getAccount = () => {
    
  }

  contributionChangeHandler = (evt) => {
    this.setState({ ...this.state, contribution: evt.target.value });
  };

  nameChangeHandler = (evt) => {
    this.setState({ ...this.state, name: evt.target.value });
  };

  messageChangeHandler = (evt) => {
    this.setState({ ...this.state, message: evt.target.value });
  };

  formSubmitHandler = async (evt) => {
    evt.preventDefault();
    const account = (await web3.eth.getAccounts())[0];
    const weiMoney = web3.utils.toWei(this.state.contribution, "ether");
    const campaignShow = campaign(this.props.campaignDetails.address);

    await campaignShow.methods
      .donations(this.state.name, this.state.message)
      .send({
        from: account,
        value: weiMoney,
      });

    this.setState({ ...this.state, contribution: "", name: "", message: "" });
    Router.pushRoute(`/campaigns/${this.props.campaignDetails.address}`);
  };

  render() {
    // console.log(this.props);
    return (
      <Layout>
        <div>
          <h1>{`${this.props.campaignDetails.campaign_Name}`}</h1>
          <hr />

          <div className="row">
            <div className="col-6">
              <h2 className="mb-4">Campaign Details</h2>
              <div
                className="card text-bg-secondary mb-3"
                style={{ maxWidth: "18rem" }}
              >
                <div className="card-header">Owner of the Campaign</div>
                <div className="card-body">
                  <h5 className="card-title">
                    {this.props.campaignDetails.owner}
                  </h5>
                  <p className="card-text">
                    This is the address of the manager who is the beneficiary
                    from the smart contract.
                  </p>
                </div>
              </div>
              <div
                className="card text-bg-success mb-3"
                style={{ maxWidth: "18rem" }}
              >
                <div className="card-header">
                  Current Balance of the Campaign
                </div>
                <div className="card-body">
                  <h5 className="card-title">
                    {web3.utils.fromWei(
                      this.props.campaignDetails.balance,
                      "ether"
                    )}
                  </h5>
                  <p className="card-text">
                    This is the total balance held in the Campaign as balance of
                    smart contract
                  </p>
                </div>
              </div>
              <div
                className="card text-bg-primary mb-3"
                style={{ maxWidth: "18rem" }}
              >
                <div className="card-header">
                  Total transactions involved with the Campaign
                </div>
                <div className="card-body">
                  <h5 className="card-title">
                    {this.props.campaignDetails.totalTransactions}
                  </h5>
                  <p className="card-text">
                    This is the sum of total (inflow + outflow) transactions
                    involved with the Campaign
                  </p>
                </div>
              </div>
            </div>

            <div className="col-6">
              <h2>Contribution</h2>
              <form onSubmit={this.formSubmitHandler}>
                <div className="mb-3">
                  <label Htmlfor="contribution" className="form-label">
                    Contribution (in Ether)
                  </label>
                  <input
                    value={this.state.contribution}
                    onChange={this.contributionChangeHandler}
                    type="text"
                    className="form-control"
                    id="contribution"
                    placeholder="Enter the amount to be donated in ethers"
                  />
                </div>
                <div className="mb-3">
                  <label Htmlfor="name" className="form-label">
                    Name of doner
                  </label>
                  <input
                    value={this.state.name}
                    onChange={this.nameChangeHandler}
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Enter the name of the doner"
                  />
                </div>
                <div className="mb-3">
                  <label Htmlfor="message" className="form-label">
                    Donation Message
                  </label>
                  <input
                    value={this.state.message}
                    onChange={this.messageChangeHandler}
                    type="text"
                    className="form-control"
                    id="message"
                    placeholder="Type your donation message here..."
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
          </div>

          <Link
            route={`/campaigns/${this.props.campaignDetails.address}/requests`}
          >
            <a>
              <button type="button" className="btn btn-primary">
                View All Requests
              </button>
            </a>
          </Link>

          <Link
            route={`/campaigns/${this.props.campaignDetails.address}/transactions`}
          >
            <a>
              <button type="button" className="btn btn-success">
                View All Transactions
              </button>
            </a>
          </Link>


          <button type="button" className="btn btn-danger" onClick={this.deleteCampaignHandler}>
            Delete The Campaign
          </button>
        </div>
      </Layout>
    );
  }
}

export default CampaignShow;

/***
 * 
 * !!!IGNORE THISSSSSS
 * 
 * <div class="card text-bg-secondary mb-3" style="max-width: 18rem;">
  <div class="card-header">Header</div>
  <div class="card-body">
    <h5 class="card-title">Secondary card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
</div>
 */

/****
 * <form>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1">
  </div>
  <div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1">
    <label class="form-check-label" for="exampleCheck1">Check me out</label>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
 */
