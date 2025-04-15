# Monorepo for Turbin3 Builders Cohort Q2 Exercises

<img src="./docs/assets/classroom.jpeg" alt="Turbin3" width="650"/>

This is a yarn monorepo. It contains the following packages:

- `docs`: Various docs prepared for classes, and other documentation assets
- `prereq\ts`: TypeScript exercises for the prerequisites
- `prereq\rust`: Rust exercises for the prerequisites
- `classes\solana-starter`: Turbin3 exercises
- `classes\vault-anchor`: Vault demo program
- `classes\escrow`: Escrow demo program
- `capstone`: Capstone project - monorepo for Riseon SocialFi app

## Minimum requirements

For Rust packages in the monorepo these are the minimum requirements.

```bash
$ rustc --version
rustc 1.81.0 (eeb90cda1 2024-09-04)

$ avm --version
avm 0.30.1

$ node --version
v23.9.0

$ yarn --version
4.7.0
```

## Getting Started

Fetch all the latest changes for the monorepo

```
git submodule update --init --recursive
```

Run the following in the monorepo root directory to install all dependencies.

```
yarn install
```

## Thanks

Many thanks to Solana Turbin3, for being an awesome school for Rust developers.

<img src="./docs/assets/turbine-logo-text.svg" alt="Turbin3" width="200"/>


## License

This code is free to use under the terms of the MIT license. See [LICENSE](LICENSE).
