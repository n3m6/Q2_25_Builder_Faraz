# Riseon Copy Trading Protol Requirements

```mermaid
sequenceDiagram
    actor User1
    actor User2
    actor Operator
    participant Vault
    participant AMM
    User1->>+Vault: Deposit
    User2->>+Vault: Deposit
    Operator->>+Vault:Initiate swap
    Vault->>+AMM: swap
    AMM-->>-Vault: tokens
    User1->>+Vault: Withdraw
    Vault-->>-User1: tokens
```

## Protocol POC Requirements

1. Protocol shall allow users to deposit SOL
2. Protocol shall allow vault operators to swap SOL any other token
3. Protocol shall calculate the balance of each token to users according to their share of SOL
4. Protocol shall allow vault operators to swap tokens to SOL
5. Protocol shall calculate the balance of SOL for each user according to their share of token that was swapped
6. Protocol shall allow users to withdraw SOL

## Account Overview

```mermaid
classDiagram
class CopyTradingVault {
    + operator: Pubkey
    + max_users: u16
    + minimum_deposit: u64
    + users: Vec[Pubkey]
    + bump: u8
}

class UserShare {
    + owner: Pubkey
    + deposit: u64
    + share: u64
    + bump: u8
}
```

### CopyTradingVault

- The account `CopyTradingVault` is the main account for the protocol. 
- The `UserShare` account is used to track the share of each user in the vault. 
- The `operator` field in the `CopyTradingVault` account is used to track the operator of the vault. 
- The `max_users` field is used to limit the number of users that can deposit into the vault. 
- The `minimum_deposit` field is used to set a minimum deposit amount for users. 
- The `users` field is used to track the users that have deposited into the vault, and verification.
- The `bump` field is used to ensure that the account is unique.

### UserShare

- The `UserShare` account is used to track the share of each user in the vault.
- The `owner` field is used to track the owner of the share.
- The `deposit` field is used to track the amount of SOL that the user has deposited into the vault.
- The `share` field is used to track the share of the user in the vault.
- The `bump` field is used to ensure that the account is unique.

## Deposit Flowcharts

```mermaid
flowchart TD
    A[User] -->|Deposit| B[CopyTradingVault]
    B -->|Check if user is already in vault| C{User exists?}
    C -->|Yes| D[Update UserShare]
    C -->|No| E[Create UserShare]
    E --> F[Update CopyTradingVault]
    F --> G[Transfer SOL to CopyTradingVault]
    G --> H[Update UserShare]
```

## Withdraw Flowcharts

```mermaid
flowchart TD
    A[User] -->|Withdraw| B[CopyTradingVault]
    B -->|Check if user is in vault| C{User exists?}
    C -->|Yes| D[Update UserShare]
    C -->|No| E[Error]
    D --> F[Update CopyTradingVault]
    F --> G[Transfer SOL to User]
    G --> H[Update UserShare]
```

## Swap Flowcharts

```mermaid
flowchart TD
    A[Operator] -->|Swap| B[CopyTradingVault]
    B -->|Check if operator is vault operator| C{Operator exists?}
    C -->|Yes| D[Update CopyTradingVault]
    C -->|No| E[Error]
    D --> F[Transfer SOL to AMM]
    F --> G[Update CopyTradingVault]
    G --> H[Transfer tokens from AMM to CopyTradingVault]
```