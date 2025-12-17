import { FileNode } from './types';

export const MOCK_FILE_SYSTEM: FileNode[] = [
  {
    id: 'root',
    name: 'openzeppelin-contracts',
    type: 'folder',
    isOpen: true,
    children: [
      {
        id: 'contracts',
        name: 'contracts',
        type: 'folder',
        isOpen: true,
        children: [
          {
            id: 'access',
            name: 'access',
            type: 'folder',
            isOpen: true,
            children: [
              {
                id: 'ownable',
                name: 'Ownable.sol',
                type: 'file',
                language: 'solidity',
                content: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../utils/Context.sol";

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        _transferOwnership(_msgSender());
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}`
              }
            ]
          },
          {
            id: 'token',
            name: 'token',
            type: 'folder',
            isOpen: false,
            children: [
              {
                id: 'erc20',
                name: 'ERC20.sol',
                type: 'file',
                language: 'solidity',
                content: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20.sol";

contract ERC20 {
    mapping(address => uint256) private _balances;
    uint256 private _totalSupply;
    string private _name;
    string private _symbol;

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }
}`
              }
            ]
          },
          {
            id: 'utils',
            name: 'utils',
            type: 'folder',
            isOpen: false,
            children: [
                {
                    id: 'context',
                    name: 'Context.sol',
                    type: 'file',
                    language: 'solidity',
                    content: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}`
                }
            ]
          }
        ]
      },
      {
        id: 'readme',
        name: 'README.md',
        type: 'file',
        language: 'markdown',
        content: '# OpenZeppelin Contracts\n\nA library for secure smart contract development.'
      },
      {
          id: 'hardhat_config',
          name: 'hardhat.config.js',
          type: 'file',
          language: 'javascript',
          content: `module.exports = {
  solidity: "0.8.20",
};`
      }
    ]
  }
];