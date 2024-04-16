import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { parseGwei } from "viem";

describe("BlobFusion", function () {
  async function deployBlobMerger() {
    const [owner, otherAccount] = await hre.viem.getWalletClients();
    const ownerAddress = owner.account.address;

    const blobFuser = await hre.viem.deployContract("BlobFusion", [
      ownerAddress,
    ]);
    const publicClient = await hre.viem.getPublicClient();

    return { blobFuser, owner, otherAccount, publicClient };
  }

  it("should set the right owner", async function () {
    const { blobFuser, owner } = await loadFixture(deployBlobMerger);
    expect((await blobFuser.read.owner()).toLowerCase()).to.equal(
      owner.account.address,
    );
  });

  it("should forward the deposit to the owner", async function () {
    const { blobFuser, owner, otherAccount, publicClient } =
      await loadFixture(deployBlobMerger);

    const balanceBefore = await publicClient.getBalance({
      address: owner.account.address,
    });

    const txValue = parseGwei(
      (Math.floor(Math.random() * 10000) + 1).toString(),
    );

    const hash = await otherAccount.sendTransaction({
      to: blobFuser.address,
      value: txValue,
    });
    await publicClient.waitForTransactionReceipt({ hash });

    const balanceAfter = await publicClient.getBalance({
      address: owner.account.address,
    });

    expect(balanceBefore + txValue).to.equal(balanceAfter);
  });

  it("should revert when trying to send an empty transaction", async function () {
    const { blobFuser, otherAccount, publicClient } =
      await loadFixture(deployBlobMerger);

    const txValue = parseGwei("0");

    let reverted = false;
    try {
      const hash = await otherAccount.sendTransaction({
        to: blobFuser.address,
        value: txValue,
      });
      await publicClient.waitForTransactionReceipt({ hash });
    } catch (error) {
      reverted = true;
    }

    expect(reverted).to.be.true;
  });

  it("should emit Deposit event when paying the contract", async function () {
    const { blobFuser, otherAccount, publicClient } =
      await loadFixture(deployBlobMerger);

    const txValue = parseGwei("500");

    const hash = await otherAccount.sendTransaction({
      to: blobFuser.address,
      value: txValue,
    });
    await publicClient.waitForTransactionReceipt({ hash });

    // get the withdrawal events in the latest block
    const withdrawalEvents = await blobFuser.getEvents.Deposit();
    expect(withdrawalEvents).to.have.lengthOf(1);
    expect(withdrawalEvents[0].args.amount).to.equal(txValue);
    expect(withdrawalEvents[0].args.depositor.toLowerCase()).to.equal(
      otherAccount.account.address,
    );
  });
});
