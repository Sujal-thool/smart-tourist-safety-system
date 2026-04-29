// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TouristIdentity {
    struct Tourist {
        address wallet;
        string identityHash;
        uint256 timestamp;
        bool isActive;
    }

    mapping(address => Tourist) public tourists;
    
    event IdentityMinted(address indexed wallet, string identityHash, uint256 timestamp);

    function mintIdentity(address _wallet, string memory _identityHash) public {
        require(!tourists[_wallet].isActive, "Identity already exists for this wallet");
        
        tourists[_wallet] = Tourist({
            wallet: _wallet,
            identityHash: _identityHash,
            timestamp: block.timestamp,
            isActive: true
        });

        emit IdentityMinted(_wallet, _identityHash, block.timestamp);
    }

    function verifyIdentity(address _wallet, string memory _identityHash) public view returns (bool) {
        Tourist memory t = tourists[_wallet];
        return (t.isActive && keccak256(abi.encodePacked(t.identityHash)) == keccak256(abi.encodePacked(_identityHash)));
    }
}
