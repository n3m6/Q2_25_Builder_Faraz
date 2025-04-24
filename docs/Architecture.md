# Riseon Copy Trading Protol Requirements

```mermaid
sequenceDiagram
    actor User
    actor Operator
    participant Vault
    participant AMM
    User->>+Vault: Deposit SOL
    Vault-->>-User: Vault token
    Operator->>+Vault:Initiate swap
    Vault->>+AMM: Swap SOL
    AMM-->>-Vault: Tokens
    Operator->>+Vault:Initiate swap
    Vault->>+AMM: Swap tokens
    AMM-->>-Vault: SOL
    User->>Vault: Unlock SOL request, burn vault token
    Note right of Vault: SOL not available for withdrawal
    Vault->>+AMM: Swap tokens
    AMM-->>-Vault: SOL
    Note right of Vault: SOL unlocked equivalent to burnt tokens
    User->>+Vault: Withdraw SOL request
    Vault-->>-User: SOL
```

## Protocol POC Requirements

1. Protocol shall allow users to deposit SOL
2. Protocol shall issue vault tokens to users
3. Protocol shall allow vault operators to swap SOL any other token
4. Protocol shall allow vault operators to swap tokens to SOL
5. Protocol shall keep a record of changes to SOL balance
6. Protocol shall allow users to initiate withdrawal of SOL by burning vault tokens
7. Protocol shall allow users to withdraw SOL when SOL is available

## Account Overview

```mermaid
classDiagram
class CopyTradingVault {
    + operator: Pubkey
    + tokens_issued: u64
    + tokens_burnt: u64
    + sol_in_trade: u64
    + token_price: u64
    + bump: u8
}

class UserClaim {
    + user: Pubkey
    + sol_amount: u64
    + bump: u8
}

```

### CopyTradingVault

The account `CopyTradingVault` is the main account for the protocol.

- `operator`: is the operator of the vault
- `tokens_issued`: is the token supply issued to users in circulation
- `tokens_burnt`: is the amount of tokens burnt BUT NOT YET WITHDRAWN
- `sol_in_trade`: is the amount of SOL in trade
- `token_price`: is the price of the token in SOL
- `bump`: unique identifier for the account

## UserClaim
The account `UserClaim` is used to keep track of the amount of SOL vault owes user after user burns his tokens.

- `user`: is the user who has a claim on the vault
- `sol_amount`: is the amount of SOL the user has a claim on
- `bump`: unique identifier for the account

## Deposit Flowcharts
```mermaid
flowchart TD
    A((User)) --> B[/Deposit SOL/]
    B --> C[Vault]
    C --> D[/Issue Vault Token/]
    D --> E((User))
```

## Withdraw Flowcharts

```mermaid
flowchart TD
    A((User)) --> B[/Burn Vault Token/]
    B --> C[Vault]
    C --> D[/Open Claim Against Vault/]
    D --> E[UserClaim]
    E --> F((User))
```

### When SOL is available

```mermaid
flowchart TD
    A((User)) --> B[/Withdraw Request/]
    B --> C[Vault]
    C --> D{Check UserClaim}
    D -->|Claim Exists| E{Check SOL Balance}
    D -->|Claim Does Not Exist| F[Error Does Not Have Claim]
    E -->|SOL Available| G[/Transfer SOL to User/]
    E -->|SOL Not Available| H[Error Not Enough SOL]
    G --> I((User))
    
```

## Swap

### SOL to token swap

```mermaid 
flowchart TD
    A((Operator)) -->B[/Initiate Swap/]
    B --> C[Vault]
    C --> K[/Check SOL Balance Minus Burnt/]
    K --> D[/Transfer SOL to AMM/]
    D --> E[AMM]
    E --> F[/Swap SOL/]
    F --> G[/Transfer Tokens to Vault/]
    G --> C
    C --> H[/Update Token Price/]
    H --> I((X))
```

### Token to SOL swap

```mermaid
flowchart TD
    A((Operator)) -->B[/Initiate Swap/]
    B --> C[Vault]
    C --> D[/Transfer Tokens to AMM/]
    D --> E[AMM]
    E --> F[/Swap Tokens/]
    F --> G[/Transfer SOL to Vault/]
    G --> C
    C --> H[/Update Token Price/]
    H --> I((X))
```

