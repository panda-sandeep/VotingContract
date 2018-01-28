var Poll = artifacts.require("./Poll.sol");

module.exports = function(deployer) {
  deployer.deploy(Poll, ['Proposal 1', 'Proposal 2', 'Proposal 3'], {from: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57'});
};
