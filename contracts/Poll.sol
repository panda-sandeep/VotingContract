pragma solidity ^0.4.18;

contract Poll {

  // Variables
  // ============  

  // The Ethereum Address that deploys this contract becomes owner of this contract
  address public owner;

  // A complex type `Struct` which is equivalent to objects in other languages like JavaScript, Java etc
  // It has two properties: `name` & `voteCount`  
  struct Proposal {
      bytes32 name;
      uint256 voteCount;
  }

  // Stores a few details about each participant  
  struct Participant {
      uint256 proposalVoted; // Index of proposal voted
      uint256 weight; // Defaults to 0 which means the voting right has not been assigned yet
      bool hasVoted; // Defaults to false
  }

  mapping (address => Participant) public participants; // Maps an Ethereum address to a Participant Object
  Proposal[] public proposals; // List of proposals

  //  Function Modifier
  modifier onlyOwner() {
      require(msg.sender == owner);
      _;
  }
  // =====

  // Events
  event ProposalAdded(address voter, bytes32 name); // When a new proposal is added
  event VoteReceived(address voter); // When a vote is received
  // ====

  // Functions
  // ============

  // Constructor function. 
  // Called at the time of deployment
  function Poll(bytes32[] proposalNames) public {
     // For each proposalName, create a new Proposal object and insert into `proposals` array 
     for (uint i = 0; i < proposalNames.length; i++) {
        Proposal memory item = Proposal({
            name: proposalNames[i],
            voteCount: 0
        });
        proposals.push(item);
    }
    owner = msg.sender; // Whoever deploys the contract becomes the owner
  }

  function addProposal(bytes32 proposalName) public {
      // Push to the proposals array
      proposals.push(Proposal({
            name: proposalName,
            voteCount: 0
      }));

      ProposalAdded(msg.sender, proposalName); // Emit an event
  }

   // Owner of the contract calls this function when they want to give voting rights to someone
  function assignVotingRight(address voter) public onlyOwner {
        // fetch the particulr `Participant` object from participants mapping 
        // and modify the weight
        Participant storage participant = participants[voter];
        participant.weight = 1;
  }

  // Function to call when someone wants to cast their vote
  function vote(uint256 index) public {
        var participant = participants[msg.sender]; // Access the Proposal object by sender address
        participant.hasVoted = true; // Change the flag to indicate that the person has voted
        participant.proposalVoted = index; // Store the proposal index
        proposals[index].voteCount++; // Increment vote count
        VoteReceived(msg.sender); // Emit an event
  }

  // Calculates the winning proposal
  function findWinningProposal() public view returns (uint256 proposalIndex) {
    // Sort the proposals array by voteCount 
    // and return the index of the one with highest votes
    uint256 highestVoteCount = 0;
    uint256 index = 0;
    for (uint i = 0; i < proposals.length; i++) {
        if (proposals[i].voteCount > highestVoteCount) {
            highestVoteCount = proposals[i].voteCount;
            index = i;
        }
    }
    return index;
  }

  function numProposals() public view returns (uint length) {
      return proposals.length;
  }
}
