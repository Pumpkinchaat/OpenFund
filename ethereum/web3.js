//only people using meta-mask or any other eth-wallet will be able to use our applicationa
import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is avaliable
  window.ethereum.request({ method: "eth_requestAccounts" });
  //getting the provider from web3 already injected and using it to create
  //out web3 >1.0 instance
  web3 = new Web3(window.ethereum);

} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/15c1d32581894b88a92d8d9e519e476c"
  );
  //not able to perform any transactions
  web3 = new Web3(provider);
}

export default web3;