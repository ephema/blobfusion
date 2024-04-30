# 🌀 BlobFusion

## 🌟 Introduction

One month ago, Dencun went live and brought us EIP-4844 and blobs.

The problem is: You always have to submit a full 128KB blob. If you have less data, then you still need to submit 128KB. This takes up unnecessary space and costs a lot of money.

Just imagine wanting to take a bus to another city – it would just be outrageous if some law forced bus companies to only accept one guest, and then let them pay for the whole bus. The whole point of them is to pool rides.

The current state of Ethereum is like that outrageous law. You have to use the full bus, even if you'd actually need less.

BlobFusion enables you to share blobs with other people by packing smaller blobs into one normal blob. This is to maximize blobspace efficiency (=good for the network) and cost (=good for the user).

### How to use

1. User sends some ETH to the Arbitrum Smart Contract
1. The server indexes the transaction and adds funds to balance
1. User sends a blob with a signature (proving this piece of data is from them) and a bid (max. amount the user is willing to pay for blob to get included) to the server
1. The server saves the blob to the DB
1. Periodically, the server tries to build a blob that satisfies all conditions (like shared cost of blob < sum of all bids, etc)
1. Blob tx gets sent to Mainnet/Sepolia

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
  - You can leave the `RPC_URL`s empty – default values will be used

### Step 3: 🏃‍♂️ Running the Project

- In one tab run local network: `npm run hardhat-network`
- In another tab deploy the contract to your network: `npm run deploy-local-contract` (make sure to fill out `DEPOSIT_CONTRACT_OWNER_PUBLIC_KEY` before – this is the account that receives the funds). Note down the contract address and put it in `DEPOSIT_CONTRACT_ADDRESS`
- Start Postgres Docker instance with `docker-compose up -d`
- Run server in development Mode: `npm run dev`
- In another tab run the frontend with `cd ./frontend && npm run dev`
- Building: `npm run build`

The backend lives at http://localhost:8080 and the frontend at http://localhost:3000.

## How It's Made

The backend uses Node.js/Express/Typescript in combination with Postgres and Prisma as an ORM. The blob transactions are currently posted to Sepolia, and deposits are made using Arbitrum Sepolia to save tx costs.

The server is made of the following parts:

- REST API (accepts requests and new blobs)
- Deposit Smart Contract and event listener (to fund user accounts)
- Blob builder and scheduler (to periodically attempt to create new blobs and send them to the network)
- The frontend is a standard Next.js/React app with Tailwind, shadcn/ui, wagmi/viem, and react-query.
