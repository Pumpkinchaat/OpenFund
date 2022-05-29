import React, { Component } from "react";
import web3 from "../../ethereum/web3";
import campaign from "../../ethereum/campaign";
import Layout from "../../components/Layout.js";

class Transactions extends Component {
  static async getInitialProps(props) {
    const campaignShow = campaign(props.query.address);

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

    return { donorsDetail, requests };
  }

  constructor(props) {
    super(props);

    this.state = {
      donorsDetail: this.props.donorsDetail,
      requests: this.props.requests,
    };
  }

  render() {
    return (
      <Layout>
        <div>
          <h1>{`Total ${
            this.state.donorsDetail.length + this.state.requests.length
          } transaction found`}</h1>
          <hr />
          <h2>Inflow</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Serial</th>
                <th scope="col">Name</th>
                <th scope="col">Message</th>
                <th scope="col">Donar Address</th>
                <th scope="col">Amount</th>
                <th scope="col">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {this.state.donorsDetail.map((detail, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{detail.name}</td>
                    <td>{detail.message}</td>
                    <td>{detail.donar}</td>
                    <td>
                      {web3.utils.fromWei(detail.amount.toString(), "ether")}
                    </td>
                    <td>
                      {new Date(Number(detail.timestamp * 1000)).toString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h2>Outflows</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Serial</th>
                <th scope="col">Reciever Address</th>
                <th scope="col">Amount Withdrawn</th>
                <th scope="col">Reason</th>
              </tr>
            </thead>
            <tbody>
              {this.state.requests.map((request, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{request.reciever}</td>
                    <td>{request.amount}</td>
                    <td>{request.reason}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Layout>
    );
  }
}

export default Transactions;
