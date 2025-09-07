-----

# 📖 0xGasless Agent Toolkit Guide

This guide provides a detailed overview of all the tools available in the 0xGasless Agentkit Toolkit. These tools enable a wide range of on-chain actions and data retrieval capabilities.

-----

## Core Wallet Actions

These tools perform fundamental on-chain operations related to your wallet, such as checking balances and transferring assets.

### `get_balance`

Retrieves the token balances of the smart account configured with the SDK.

  - **Usage**:
    1.  Call with no parameters to get balances for all supported tokens.
    2.  Provide an array of ticker symbols (e.g., `["ETH", "USDC"]`) to get specific balances.
    3.  Provide an array of token contract addresses to get specific balances.
  - **Guidance**: This tool should be used immediately when a user asks to check balances. It is a read-only operation.

### `get_address`

Retrieves the smart account address configured with the SDK.

  - **Usage**: Call with no parameters.
  - **Guidance**: Use this tool when a user asks for their wallet or account address.

### `get_eoa_address`

Returns the Externally Owned Account (EOA) wallet address.

### `get_eoa_balance`

Returns the native balance and optional ERC-20 balances of the EOA.

### `smart_transfer`

Transfers an ERC20 token or native currency from the wallet to another address gaslessly.

  - **Parameters**:
      - `amount` (string, required): The amount to transfer.
      - `tokenAddress` (string, required): The token contract address. Use `'eth'` for native currency.
      - `destination` (string, required): The recipient's on-chain address.
  - **Note**: Gasless transfers are supported on Avalanche C-Chain, Sonic, BASE, BNB Chain, and Moonbeam.

### `smart_swap`

Performs gasless token swaps on supported chains.

  - **Parameters**:
      - `tokenIn` / `tokenOut` (string): The contract addresses for the swap.
      - `tokenInSymbol` / `tokenOutSymbol` (string): The token symbols for the swap (e.g., "AVAX", "USDC").
      - `amount` (string, required): The amount of the input token to swap.
      - `slippage` (string, optional): Slippage tolerance (e.g., "0.5"). Defaults to "auto".
      - `approveMax` (boolean, optional): Whether to approve the maximum token allowance. Defaults to `false`.
  - **Guidance**: Provide either token addresses OR token symbols.

### `disperse_tokens`

Enables gasless batch transfers of a single token type to multiple recipients.

  - **Parameters**:
      - `recipients` (array, required): An array of objects, where each object is `{ address: string, amount: string }`.
      - `tokenAddress` (string, required): The token contract address to disperse. Use `'eth'` for native currency.
  - **Note**: Supports up to 50 recipients per batch for optimal performance.

-----

## Cross-Chain Functionality

### `smart_bridge`

Bridges tokens between different chains using Debridge DLN.

  - **Parameters**:
      - `fromChainId` (number, required): The source chain ID (e.g., `43114` for Avalanche).
      - `toChainId` (number, required): The destination chain ID (e.g., `1` for Ethereum).
      - `tokenInAddress` (string, required): The input token address on the source chain.
      - `tokenOutAddress` (string, required): The output token address on the destination chain.
      - `amount` (string, required): The amount of the input token to bridge.
      - `recipientAddress` (string, optional): The address to receive tokens on the destination chain. Defaults to the agent's wallet.
  - **Note**: While the source chain transaction is gasless via 0xGasless, the Debridge protocol itself charges a fixed fee in the source chain's native currency (e.g., AVAX), which must be present in the smart account.

-----

## On-Chain Data & Analytics

### `execute_sxt_sql`

Executes a read-only ANSI-SQL query against the Space and Time Managed Database.

  - **Parameter**:
      - `sqlText` (string, required): The full SQL statement to execute.
  - **Limitations**: This is a read-only tool. `INSERT`, `UPDATE`, `DELETE`, etc., are not allowed.
  - **Example Query**:
    ```sql
    SELECT exchange_name, COUNT(*)
    FROM eth.dex_trade
    GROUP BY exchange_name
    ORDER BY 2 DESC
    LIMIT 10;
    ```

-----

## Market Data (DexScreener)

These tools fetch real-time market data from the DexScreener API.

  - **`get_latest_token_profiles`**: Fetches the newest token profiles.
  - **`get_latest_boosted_tokens`**: Fetches recently boosted tokens.
  - **`get_top_boosted_tokens`**: Fetches tokens with the most active boosts.
  - **`get_token_orders`**: Checks paid promotion orders for a specific token.
      - **Requires**: `chainId`, `tokenAddress`.
  - **`get_pairs_by_chain_and_address`**: Gets detailed information for a specific trading pair.
      - **Requires**: `chainId`, `pairId`.
  - **`search_pairs`**: Searches for trading pairs matching a query (e.g., "WAVAX/USDC").
      - **Requires**: `query`.
  - **`get_pairs_by_token_addresses`**: Gets all pairs that include one or more specified token addresses.
      - **Requires**: `chainId`, `tokenAddresses` (comma-separated string).

-----

## Utility & Security

  - **`get_token_details`**: Fetches details (name, symbol, decimals) for an ERC20 token.
      - **Requires**: `tokenAddress`.
  - **`check_transaction_status`**: Checks the status of a submitted transaction.
      - **Requires**: `userOpHash`.
  - **`create_and_store_key`**: Generates a new private key and returns the corresponding public address. The key is stored locally in a `keys.db` SQLite database if run in a Node.js/Bun environment.