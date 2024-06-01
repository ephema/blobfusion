# 🌀 BlobFusion

Check out the live demo using Sepolia at https://blobfusion.ephema.io

## 🌟 Introduction

In March 2024, Dencun went live and brought us EIP-4844 and blobs.

The problem is: You always have to send a full 128KB blob. If you have less data, you still have to send 128KB. This takes up unnecessary space and costs a lot of money.

Imagine wanting to take a bus to another city - it would be outrageous if some law forced bus companies to take only one passenger and then make you pay for the whole bus. The whole point of using a bus is to pool rides.

This is the current state of Ethereum. You have to take the whole bus, even if you'd actually need less.

BlobFusion allows you to share blobs with other people by packing smaller blobs into a normal blob. The idea is to maximize blobspace efficiency (=good for the network) and cost (=good for the user).

### How it works

1. User sends some ETH to Arbitrum Smart Contract
1. Server indexes the transaction and adds funds to the balance
1. User sends a blob with a signature (proving that this piece of data is from them) and a bid (maximum amount the user is willing to pay for the blob to be included) to the server
1. Server stores the blob in private mempool
1. Periodically, the server tries to build a blob that satisfies all conditions (like shared cost of blob < sum of all bids, etc.)
1. Blob tx is sent to Mainnet/Sepolia

## 🛠️ Getting Started

### Step 1: 🚀 Initial Setup

- Clone the repository: `git clone https://github.com/ephema/blobfusion.git`
- Navigate: `cd blobfusion`
- Install dependencies: `npm ci && cd ./frontend && npm ci`

### Step 2: ⚙️ Environment Configuration

- Create `.env`: Copy `.env.template` to `.env`
- Update `.env`: Fill in necessary environment variables:
  - `BLOB_SUBMITTER_*` is for the network that receives the blobs
  - `DEPOSIT_CONTRACT_` is for the network that hosts the Deposit contract
  - You can leave the `RPC_URL`s empty if you want – default values will be used

### Step 3: 🏃‍♂️ Running the Project

- [Tab 1] In one tab run local network: `npm run hardhat-network`
- [Tab 2] In another tab deploy the contract to your network: `npm run deploy-local-contract` (make sure to fill out `DEPOSIT_CONTRACT_OWNER_PUBLIC_KEY` before – this is the account that receives the funds). Note down the contract address and put it in `DEPOSIT_CONTRACT_ADDRESS`
- [Tab 2] Start Postgres Docker instance with `docker-compose up -d`
- [Tab 2] Run server in development Mode: `npm run dev`
- [Tab 3] In another tab run the frontend with `cd ./frontend && npm run dev`

**The backend is available at http://localhost:8080 and the frontend at http://localhost:3000.**

#### Build

- Building the backend: `npm run build`
- Building the frontend: `cd frontend && npm run build`

## How It's Made

The backend uses Node.js/Express/Typescript in combination with Postgres and Prisma as an ORM. The blob transactions are currently posted to Sepolia, and deposits are made using Arbitrum Sepolia to save tx costs.

The server is made of the following parts:

- REST API (accepts requests and new blobs)
- Deposit Smart Contract and event listener (to fund user accounts)
- Blob builder and scheduler (to periodically attempt to create new blobs and send them to the network)
- The frontend is a standard Next.js/React app with Tailwind, shadcn/ui, wagmi/viem, and react-query.
