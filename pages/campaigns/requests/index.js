import React, { Component } from "react";
import Layout from "../../../components/Layout";
import web3 from "../../../ethereum/web3";
import campaign from "../../../ethereum/campaign";
import { Link, Router } from "../../../routes";

class Requests extends Component {
  static async getInitialProps(props) {
    const campaignShow = campaign(props.query.address);

    const owner = await campaignShow.methods.owner().call();

    const donorsDetailLength = await campaignShow.methods
      .getDonarDetailsLength()
      .call();

    let donorsDetail = [];

    for (let i = 0; i < donorsDetailLength; i++) {
      const detail = await campaignShow.methods.donors_details(i).call();
      donorsDetail.push(detail);
    }

    const requestLength = await campaignShow.methods.getRequestLength().call();

    let requests = [];

    for (let i = 0; i < requestLength; i++) {
      const request = await campaignShow.methods.request(i).call();
      if (!request.status) requests.push({ request, index: i });
    }

    return { requests, owner, address: props.query.address, donorsDetail };
  }

  constructor(props) {
    super(props);

    this.state = {
      requests: this.props.requests,
      owner: this.props.owner,
      address: this.props.address,
      donorsDetail: this.props.donorsDetail,
      account: "",
    };

    this.canVote();
    this.canFinalize();
  }

  getAccount = async () => {
    const address = (await web3.eth.getAccounts())[0];
    if (this.state.address !== address)
      this.setState({
        ...this.state,
        address: (await web3.eth.getAccounts())[0],
      });
  };

  canVote = () => {
    const account = this.state.address;

    for (let i = 0; i < this.state.donorsDetail.length; i++) {
      if (account == this.state.donorsDetail[i].donar) {
        return true;
      }
    }
    return false;
  };

  canFinalize = async () => {
    const account = this.state.address;

    if (account == this.state.owner) return true;
    else return false;
  };

  voteButtonHandler = async (index) => {
    const campaignShow = campaign(this.state.address);
    // console.log(index);
    console.log(campaignShow);

    await campaignShow.methods.voting(index).send({
      from: this.state.address
    });

    Router.pushRoute(`/campaigns/${this.state.address}/requests`);
  };

  finalizeButtonHandler = async (index) => {
    const campaignShow = campaign(this.state.address);

    await campaignShow.methods.finalSubmition(index).send({
      from: this.state.address
    });

    Router.pushRoute(`/campaigns/${this.state.address}/requests`);
  };

  render() {
    this.getAccount();
    return (
      <Layout>
        <h1>Pending Requests</h1>
        <hr />
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Serial</th>
              <th scope="col">Reciever's Address</th>
              <th scope="col">Amount Requested</th>
              <th scope="col">Approval Percentage</th>
              <th scope="col">Reason</th>
              <th scope="col">Vote Button</th>
              <th scope="col">Finalize Button</th>
            </tr>
          </thead>
          <tbody>
            {this.state.requests.map((request, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{request.request.receiver}</td>
                  <td>
                    {web3.utils.fromWei(request.request.amount, "ether")} ether
                  </td>
                  <td>{request.request.votingPercentage}%</td>
                  <td>{request.request.reason}</td>
                  <td>
                    {this.canVote() ? (
                      <button
                        onClick={() => {
                          this.voteButtonHandler(request.index);
                        }}
                        type="button"
                        className="container-fluid btn btn-success"
                      >
                        Vote
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="container-fluid btn btn-danger"
                        disabled
                      >
                        Not a Doner
                      </button>
                    )}
                  </td>
                  <td>
                    {this.canFinalize() ? (
                      <button
                        onClick={() => {
                          this.finalizeButtonHandler(request.index);
                        }}
                        type="button"
                        className="container-fluid btn btn-success"
                      >
                        Finalize
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="container-fluid btn btn-danger"
                        disabled
                      >
                        Not the manager (owner)
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Layout>
    );
  }
}

export default Requests;
