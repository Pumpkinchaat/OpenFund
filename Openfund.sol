pragma solidity ^0.4.17;
contract CampaignList{
    address[] public camp_address;
    string public name;
    function createCampaign(string ) public {
        address addr_campaign = address(new Campaign(msg.sender,name));
        camp_address.push(addr_campaign);
    }

    function getDeployedCampaigns() public view returns(address[] memory) {
        return camp_address;
    }
}

contract Campaign{

    struct Donor_details{
        address donar;
        uint amount;
    }

    struct Requests{
        address receiver;
        uint amount;
        uint votingPercentage;
        string reason;
        bool status;
        mapping(address => bool) voters;
    }

    address public owner;
    string public campaign_Name;
    uint public balance;
    mapping(address => bool) donors;
    mapping(address => uint) public donors_amount;
    Requests[] public request;
    Donor_details[] public donors_details;

    //events
    event moneysedners(string name, address sender, uint amount, string message,uint timestamp);
    event RequestesDone(string reason, uint amount, address receiver,uint percentage);

    constructor(address creator, string name) public{
        owner = creator;
        campaign_Name = name;
    }

    //users can donate here the aount they want for a particu;ar campaign

    function donations(uint amount,string memory name,string memory message) payable public{
        require(amount *1 ether == msg.value, "Please check the amount entered");
        donors_details.push(Donor_details(msg.sender,amount));
        donors[msg.sender] = true;
        donors_amount[msg.sender] += amount;
        balance += amount;
        emit moneysedners(name,msg.sender,amount,message,block.timestamp);
    }

    //the function restricted to owner,  the owner creats the request asking
    //certain amount of money from total balance and stating reason behind that

    function CreateRequest(string memory reason, uint amount, address receiver) public restricted {
        request.push(Requests(receiver, amount,0,reason,false));
    }

    //The function allows the users to vote and gives 1 vote to 1 donar
    //checks whether the voter is a donar or not

    function voting(uint index) public {
        //checking whether a donar or not
        require(donors[msg.sender]);
        //checking whether voted or not
        require(!request[index].voters[msg.sender]);
        require(!request[index].status,"already sent transaction");
        request[index].voters[msg.sender] = true;
    }

    //restricted ot owner to finalize the transfer of money
    //The function checks based upon the contribution from the total amount
    //of indivisual voters and make sure that the total percentage is more than 50
    //if yes the transaction proceeds and the request closes

    function finalSubmition(uint index) public restricted{
       Requests storage req = request[index];
       uint percent =0;
       uint amount= 0;
       address adrs;
       for(uint i=0;i<donors_details.length;++i){
           if(req.voters[donors_details[i].donar]){
                adrs = donors_details[i].donar;
                amount = donors_amount[adrs];
                percent= uint(100/balance)*amount;
           }
       }
       req.votingPercentage = percent;
       require(req.votingPercentage>50, "not enough percentage");
       require(!req.status,"already sent transaction");
       req.receiver.transfer((req.amount)*1 ether);
       balance -= req.amount;
       req.status = true;

       emit RequestesDone(req.reason, req.amount,req.receiver,req.votingPercentage);
    }

    modifier restricted(){
        require(msg.sender == owner);
        _;
    }

}