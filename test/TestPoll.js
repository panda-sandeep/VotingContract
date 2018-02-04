var Poll = artifacts.require("Poll");

contract('Poll', function(accounts) {
    
    it('should return the number of proposals', function(done){
        Poll.deployed().then(function(instance) {
            instance.numProposals.call().then(function(data){
                assert.equal(Number(data.toString(10)), 3, 'Proposals were not stored correctly');
                done();
            });
       });
    });

    it('should retrieve first proposal correctly', function(done){
        Poll.deployed().then(function(instance) {
            instance.proposals.call(0).then(function(data){
                data = data.toString().split(',');
                var name = web3.toUtf8(data[0]);
                assert.equal(name, 'Proposal 1', 'The first proposal is incorrect');
                done();
            });
       });
    });

    it('should assign voting rights correctly', function(done){
        Poll.deployed().then(function(instance) {
            instance.assignVotingRight(accounts[1]).then(function(){
                instance.participants.call(accounts[1]).then(function(data){
                    assert.equal(data.toString(), '0,1,false', 'The voting right wasn\'t assigned');
                    done();
                });
            });
       });
    });

    it('should increment vote count of Proposal 2 by 1', function(done){
        Poll.deployed().then(function(instance) {
            instance.vote(1, {from: accounts[1]}).then(function(){
                instance.proposals.call(1).then(function(data){
                    assert.equal(data.toString().split(',')[1], '1', 'The vote count was not incremented');
                    done();
                });
            });
       });
    });

    it('should add one more vote to Proposal 2', function(done){
        Poll.deployed().then(function(instance) {
            instance.vote(1, {from: accounts[1]}).then(function(){
                instance.proposals.call(1).then(function(data){
                    assert.equal(data.toString().split(',')[1], '2', 'The vote count was not incremented');
                    done();
                });
            });
       });
    });

    it('should add one vote to Proposal 1 & emit VoteReceived event', function(done){
        Poll.deployed().then(function(instance) {
            instance.vote(1, {from: accounts[1]}).then(function(result){
                assert.equal(result.logs[0].event, 'VoteReceived', 'The vote was not received');
                done();
            });
       });
    });

    // Let's add a new proposal and check whether the event was emitted
    it('should add a proposal & emit ProposalAdded Event', function(done){
        Poll.deployed().then(function(instance) {
            instance.addProposal('Proposal 4').then(function(result){
                assert.equal(result.logs[0].event, 'ProposalAdded', 'The proposal could not be added');
                done();
            });
       });
    });

    it('should find the winning proposal', function(done){
        Poll.deployed().then(function(instance) {
            instance.findWinningProposal().then(function(data){
                assert.equal(data.toString(), '1', 'The winning proposal was not found');
                done();
            });
       });
    });

    // onlyOwner Modifier test. It should fail.
    // Let's try to assign voting rights to `accounts[3]` and make the transaction from `accounts[4]`.
    it('Only owner can assign voting rights', function(done){
        Poll.deployed().then(function(instance) {
            instance.assignVotingRight(accounts[3], {from: accounts[4]}).then(function(){
                done();
            });
       });
    });
});