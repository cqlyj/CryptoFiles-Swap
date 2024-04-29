## Overview

This project aims to create a decentralized platform for securely storing and trading files using blockchain technology. Users can upload files to IPFS, tokenize them as digital assets on the Ethereum blockchain, and trade them in a secure marketplace.

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">Overview</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## Getting Started

1. Clone the repository:

```sh
 git clone https://github.com/cqlyj/CryptoFiles-Swap.git
```

2. Install dependencies:

```sh
yarn install
```

3. Compile the smart contracts:

```sh
yarn hardhat compile
```

or

```sh
hh compile
```

4. Run the test:

```sh
yarn hardhat test
```

or

```sh
hh test
```

5. Create your own .env file. Follow the .env.example file.

6. Deploy the contract:

```sh
yarn hardhat deploy --network sepolia
```

or

```sh
hh deploy --network sepolia
```

7. Now you can run some scripts to interact with the contract:

```sh
yarn hardhat run scripts/WHAT_SCRIPTS_YOU_WANT_TO_RUN --network sepolia
```

or

```sh
hh run scripts/WHAT_SCRIPTS_YOU_WANT_TO_RUN --network sepolia
```

## License

MIT

## Contact

Your Name - Luo Yingjie - luoyingjie0721@gmail.com
