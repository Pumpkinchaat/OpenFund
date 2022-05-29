const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

//this will determine the "build" folder path and delete it incase it already exists
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

//generating the output from the solidity compiler
const contractPath = path.resolve(__dirname, "contracts", "Openfund.sol");
const source = fs.readFileSync(contractPath, "utf8");
const output = solc.compile(source, 1).contracts;
console.log(solc.compile(source , 1));

//this will make the build folder once more
fs.ensureDirSync(buildPath);

//output to the build folder {we need the ABI(interface) and the bytecode(machine level)}
for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    output[contract]
  );
}

console.log("The compilation has concluded successfully");
