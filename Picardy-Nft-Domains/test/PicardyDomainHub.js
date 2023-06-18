const { assert, expect } = require("chai");
const chai = require("chai");
const { ethers } = require("hardhat");
chai.use(require("chai-as-promised"));

describe("PicardyDomainHub", function () {
  let metadataContract;
  let picardyDomainHub;
  beforeEach(async () => {
    //import Metadata contract for deployment.

    const PicardyDomainMetadata = await ethers.getContractFactory(
      "PicardyDomainMetadata"
    );
    metadataContract = await PicardyDomainMetadata.deploy();

    const PicardyDomainHub = await ethers.getContractFactory(
      "PicardyDomainHub"
    );

    picardyDomainHub = await PicardyDomainHub.deploy(metadataContract.address);
  });

  it("only hub admin can init", async () => {
    const [hubAdmin, user1, user2, user3, factory, forbiddenTld] =
      await ethers.getSigners();

    await expect(
      picardyDomainHub
        .connect(user1)
        .init(factory.address, forbiddenTld.address)
    ).to.be.rejectedWith(Error);

    await picardyDomainHub.init(factory.address, forbiddenTld.address);
  });

  it("only hub admin can add factroy address", async () => {
    const [hubAdmin, user1, user2, user3, factory, forbiddenTld] =
      await ethers.getSigners();

    await picardyDomainHub.init(factory.address, forbiddenTld.address);

    await expect(
      picardyDomainHub.connect(user1).addFactoryAddress(factory.address)
    ).to.be.rejectedWith(Error);

    await picardyDomainHub.addFactoryAddress(factory.address);
  });

  it("only admin can add tld", async () => {
    const [hubAdmin, user1, user2, user3, factory, forbiddenTld] =
      await ethers.getSigners();

    await picardyDomainHub.init(factory.address, forbiddenTld.address);

    await expect(
      picardyDomainHub.connect(user1).addForbiddenTlds(forbiddenTld.address)
    ).to.be.rejectedWith(Error);

    await picardyDomainHub.addForbiddenTlds(forbiddenTld.address);
  });

  it("only admin can change metadataAddress", async () => {
    const [hubAdmin, user1, user2, user3, factory, forbiddenTld] =
      await ethers.getSigners();

    await picardyDomainHub.init(factory.address, forbiddenTld.address);

    await expect(
      picardyDomainHub
        .connect(user1)
        .changeMetadataAddress(metadataContract.address)
    ).to.be.rejectedWith(Error);

    await picardyDomainHub.changeMetadataAddress(metadataContract.address);
  });

  it("only admin can withdraw ETH", async () => {
    const [hubAdmin, user1, user2, user3, factory, forbiddenTld] =
      await ethers.getSigners();

    await picardyDomainHub.init(factory.address, forbiddenTld.address);

    await expect(
      picardyDomainHub.connect(user1).withdrawEth()
    ).to.be.rejectedWith(Error);

    await picardyDomainHub.withdrawEth();
  });
});
