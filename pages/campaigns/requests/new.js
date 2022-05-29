import React, { Component } from "react";
import web3 from "../../../ethereum/web3";
import campaign from "../../../ethereum/campaign";
import { Link, Router } from "../../../routes";

class Requests extends Component {
  static async getInitialProps(props) {
    const campaignShow = campaign(props.query.address);

    const account = (await web3.eth.getAccounts())[0];

    const owner = await campaignShow.methods.owner().call();

    let finalizeTest = true;
    if (owner != account) finalizeTest = false;

    const donorsDetailLength = await campaignShow.methods
      .getDonarDetailsLength()
      .call();

    let donorsDetail = [];

    let canVote = false;

    for (let i = 0; i < donorsDetailLength; i++) {
      const detail = await campaignShow.methods.donors_details(i).call();
      if (detail.donar == account) canVote = true;
    }

    const requestLength = await campaignShow.methods.getRequestLength().call();

    let requests = [];

    for (let i = 0; i < requestLength; i++) {
      const request = await campaignShow.methods.request(i).call();
      if (!request.status) requests.push({ request, index: i });
    }

    return { requests, owner, address: props.query.address, canVote , finalizeTest };
  }

  constructor(props) {
    super(props);

    this.state = {
      requests: this.props.requests,
      owner: this.props.owner,
      finalizeButton: this.props.finalizeTest,
      canVote: this.props.canVote,
    };
  }

  finalizeButtonHandler = async (requestIndex) => {
    const campaignShow = campaign(this.props.address);
    const account = (await web3.eth.getAccounts())[0];

    await campaignShow.methods.finalSubmition(requestIndex).send({
      from: account,
      gas: "10000000",
    });

    Router.pushRoute(`/campaigns/${this.props.address}/requests`);
  };

  voteHandler = async (requestIndex) => {
    const campaignShow = campaign(this.props.address);
    const account = (await web3.eth.getAccounts())[0];

    await campaignShow.methods.voting(requestIndex).send({
      from: account,
      gas: "10000000",
    });

    Router.pushRoute(`/campaigns/${this.props.address}/requests`);
  };

  render() {
    return (
      <div>
        <h2>Pending Requests</h2>
        <ol>
          {this.state.requests.map((request, index) => {
            return (
              <li key={index}>
                <div>
                  <ul>
                    <li>Reciever-- {`${request.request.receiver}`}</li>
                    <br />
                    <li>Amount-- {`${request.request.amount}`}</li>
                    <br />
                    <li>
                      Approval Percentage--{" "}
                      {`${request.request.votingPercentage}`}
                    </li>
                    <br />
                    <li>Reason-- {`${request.request.reason}`}</li>
                    <br />
                  </ul>
                </div>
                {this.state.finalizeButton ? (
                  <button onClick={() => this.finalizeButtonHandler(request.index)}>Finalize</button>
                ) : (
                  <button disabled>Finalize NOT allowed</button>
                )}
                {this.state.canVote ? (
                  <button onClick={() => this.voteHandler(request.index)}>VOTE</button>
                ) : (
                  <button disabled>Voting NOT allowed</button>
                )}
              </li>
            );
          })}
          {}
        </ol>
      </div>
    );
  }
}

export default Requests;

/**
 * <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Larry the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
 */