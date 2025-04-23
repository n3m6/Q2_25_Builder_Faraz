# Riseon Copy Trading Protol Requirements

```mermaid
sequenceDiagram
    actor User-1
    actor User-n
    actor Operator
    participant Vault
    participant AMM
    User-1->>+Vault: Deposit SOL
    User-n->>+Vault: Deposit SOL
    Operator->>+Vault:Initiate swap
    Vault->>+AMM: swap SOL
    AMM-->>-Vault: tokens
    Operator->>+Vault:Initiate swap
    Vault->>+AMM: swap tokens
    AMM-->>-Vault: SOL
    User-1->>+Vault: Withdraw
    Vault-->>-User-1: SOL
```

## Protocol POC Requirements

1. Protocol shall allow users to deposit SOL
2. Protocol shall allow vault operators to swap SOL any other token
3. Protocol shall allow vault operators to swap tokens to SOL
4. Protocol shall keep a record of changes to SOL balance
5. Protocol shall allow users to withdraw SOL

## Account Overview

```mermaid
classDiagram
class CopyTradingVault {
    + operator: Pubkey
    + max_users: u16
    + minimum_deposit: u64
    + users: Vec[Pubkey]
    + balance_ledger: Vec[BalanceState]
    + bump: u8
}

class BalanceState {
    + update: u8
    + balance: u64
}

class UserShare {
    + owner: Pubkey
    + share: u64
    + balance_ledger: u64
    + bump: u8
}
```

### CopyTradingVault

The account `CopyTradingVault` is the main account for the protocol.

- `operator`: is the operator of the vault
- `max_users`: maximum number of users that can deposit into the vault
- `minimum_deposit`: minimum deposit amount for users
- `users`: a list of users that have deposited into the vault
- `balance_ledger`: a list of changes to SOL balance of the vault
- `bump`: unique identifier for the account

### BalanceState

BalanceState is a data structure that tracks the changes to the SOL balance of the vault.

- `update`: the type of update (e.g., deposit, withdraw, swap represented by a u8)
- `balance`: the new balance of the vault after the update

### UserShare

The `UserShare` account is used to track the share of each user in the vault.

- `owner`: the owner of the share
- `share`: the share of user's SOL in the vault
- `balance_ledger`: the position of the user in the balance state chain
- `bump`: unique identifier for the account

## Deposit Flowcharts

```mermaid
flowchart TD
    A[User] -->|Deposit| B[CopyTradingVault]
    B -->|Check if user is already in vault| C{User exists?}
    C -->|Yes| D[Update CopyTradingVault balance_ledger]
    D --> I[Update UserShare]
    C -->|No| E[Create UserShare]
    E --> F[Update CopyTradingVault balance_ledger]
    F --> G[Transfer SOL to CopyTradingVault]
    G --> H[Update UserShare]
```

- User deposits SOL and if the user is not present in the vault a UserShare account is created for the user

## Swap Flowcharts

```mermaid
flowchart TD
    A[Operator] -->|Swap| B[CopyTradingVault]
    B -->|Check if operator is vault operator| C{Operator?}
    C -->|Yes| D[Transfer SOL to AMM]
    C -->|No| E[Error]
    D --> F[Swap SOL to tokens]
    F --> G[Transfer tokens from AMM to CopyTradingVault]
    G --> H[Update balance_ledger]
```

- For tokens to SOL the flow is the same except the swap is from tokens to SOL

## Withdraw Flowcharts

```mermaid
flowchart TD
    A[User] -->|Withdraw| B[CopyTradingVault]
    B -->|Check if user is in vault| C{User exists?}
    C -->|Yes| D[Update UserShare using balance_ledger]
    C -->|No| E[Error]
    D --> F[Transfer SOL to User using updated balance]
    F --> G[Update balance_ledger]
    G --> H[Update UserShare]
```

- Tokens have to be converted to SOL before they can be withdrawn
