// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Crowdfunding {

    struct Campaign {

        string name;

        uint256 goal;

        uint256 raised;

        address payable beneficiary;

        bool ended;

    }

    mapping (uint256 => Campaign) public campaigns;

    uint256 public nextCampaignId = 0;

    function createCampaign(string memory name, uint256 goal, address payable beneficiary) external {

        campaigns[nextCampaignId] = Campaign(name, goal, 0, beneficiary, false);

        nextCampaignId++;

    }

    function contribute(uint256 id, uint256 amount, IERC20 cUSD) external {

        Campaign storage campaign = campaigns[id];

        require(!campaign.ended, "Campaign has already ended");

        cUSD.transferFrom(msg.sender, address(this), amount);

        campaign.raised += amount;

        if (campaign.raised >= campaign.goal) {

            campaign.ended = true;

            campaign.beneficiary.transfer(campaign.raised);

        }

    }

    function getCampaign(uint256 id) external view returns (string memory name, uint256 goal, uint256 raised, bool ended) {

        Campaign storage campaign = campaigns[id];

        return (campaign.name, campaign.goal, campaign.raised, campaign.ended);

    }

    function getBalance(IERC20 cUSD) external view returns (uint256) {

        return cUSD.balanceOf(address(this));

    }

    function withdraw(IERC20 cUSD) external {

        uint256 balance = cUSD.balanceOf(address(this));

        cUSD.transfer(msg.sender, balance);

    }

}

