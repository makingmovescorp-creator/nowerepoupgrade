// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IPulseXRouter02 {
    function WETH() external pure returns (address);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;

    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable;

    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
}

contract PulseXFeeWrapper is Ownable2Step, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IPulseXRouter02 public immutable router;
    address public immutable WPLS;

    address public treasury;
    uint256 public feeBps = 1; // 0.01% = 1 bps
    uint256 public constant MAX_FEE_BPS = 25; // górny limit bezpieczeństwa 0.25%

    event TreasuryChanged(address indexed newTreasury);
    event FeeBpsChanged(uint256 newFeeBps);

    constructor(address _router, address _treasury) {
        require(_router != address(0) && _treasury != address(0), "bad addr");
        router = IPulseXRouter02(_router);
        treasury = _treasury;
        WPLS = IPulseXRouter02(_router).WETH(); // na PulseChain WETH zwykle to WPLS
    }

    // --- admin ---
    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "zero");
        treasury = _treasury;
        emit TreasuryChanged(_treasury);
    }

    function setFeeBps(uint256 _feeBps) external onlyOwner {
        require(_feeBps <= MAX_FEE_BPS, "fee too high");
        feeBps = _feeBps;
        emit FeeBpsChanged(_feeBps);
    }

    // --- internal helpers ---
    function _takeFee(address tokenIn, uint256 amountIn) internal returns (uint256 netAmount) {
        uint256 fee = (amountIn * feeBps) / 10_000; // 1 bps = /10_000
        if (fee > 0) {
            IERC20(tokenIn).safeTransfer(treasury, fee);
        }
        unchecked { netAmount = amountIn - fee; }
    }

    // --- token -> token ---
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external nonReentrant {
        require(path.length >= 2, "path");
        address tokenIn = path[0];

        // pobierz tokeny od użytkownika
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);

        // nalicz fee
        uint256 netIn = _takeFee(tokenIn, amountIn);

        // approve tylko netIn
        IERC20(tokenIn).forceApprove(address(router), 0);
        IERC20(tokenIn).forceApprove(address(router), netIn);

        router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            netIn,
            amountOutMin,
            path,
            to,
            deadline
        );
    }

    // --- native PLS -> token ---
    function swapExactETHForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable nonReentrant {
        require(path.length >= 2 && path[0] == WPLS, "path/WPLS");
        uint256 amountIn = msg.value;
        require(amountIn > 0, "no value");

        uint256 fee = (amountIn * feeBps) / 10_000;
        if (fee > 0) {
            (bool s, ) = payable(treasury).call{value: fee}("");
            require(s, "treasury fail");
        }
        uint256 netIn;
        unchecked { netIn = amountIn - fee; }

        router.swapExactETHForTokensSupportingFeeOnTransferTokens{value: netIn}(
            amountOutMin,
            path,
            to,
            deadline
        );
    }

    // --- token -> native PLS ---
    function swapExactTokensForETH(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external nonReentrant {
        require(path.length >= 2 && path[path.length-1] == WPLS, "path/WPLS");
        address tokenIn = path[0];

        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        uint256 netIn = _takeFee(tokenIn, amountIn);

        IERC20(tokenIn).forceApprove(address(router), 0);
        IERC20(tokenIn).forceApprove(address(router), netIn);

        router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            netIn,
            amountOutMin,
            path,
            to,
            deadline
        );
    }

    // w razie niechcianych środków
    function rescueTokens(address token, uint256 amount, address to_) external onlyOwner {
        IERC20(token).safeTransfer(to_, amount);
    }

    receive() external payable {}
}