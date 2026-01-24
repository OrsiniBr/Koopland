// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";


contract IdeaMarketplaceNFT  {

    using SafeERC20 for IERC20;


    function transferToken(address tokenAddress, address to, uint256 amount) public {
        IERC20(tokenAddress).safeTransfer(to, amount);
    }

}