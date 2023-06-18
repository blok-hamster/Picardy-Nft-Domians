const { assert, expect } = require("chai");
const chai = require("chai");
const { ethers } = require("hardhat");
chai.use(require("chai-as-promised"));

describe("ForbiddenTlds", function () {
  let forbiddenTlds;
  let picardyDomainHub;
  let metadataContract;
  beforeEach(async () => {
    const PicardyDomainMetadata = await ethers.getContractFactory(
      "PicardyDomainMetadata"
    );
    metadataContract = await PicardyDomainMetadata.deploy();

    const PicardyDomainHub = await ethers.getContractFactory(
      "PicardyDomainHub"
    );
    picardyDomainHub = await PicardyDomainHub.deploy(metadataContract.address);

    const ForbiddenTld = await ethers.getContractFactory("ForbiddenTldsV2");
    forbiddenTlds = await ForbiddenTld.deploy(picardyDomainHub.address);
  });

  it("only hubAdmain can addForbiddenTld", async () => {
    const [hubAdmin, user1, user2, user3, factory] = await ethers.getSigners();

    await picardyDomainHub.init(factory.address, forbiddenTlds.address);

    await expect(
      forbiddenTlds.connect(user1).addFactoryAddress(factory.address)
    ).to.be.rejectedWith(Error);

    await forbiddenTlds.addFactoryAddress(factory.address);
  });

  it("only hubAdmin can remove factoryAddress", async () => {
    const [hubAdmin, user1, user2, user3, factory] = await ethers.getSigners();

    await picardyDomainHub.init(factory.address, forbiddenTlds.address);

    await expect(
      forbiddenTlds.connect(user1).removeFactoryAddress(factory.address)
    ).to.be.rejectedWith(Error);

    await forbiddenTlds.removeFactoryAddress(factory.address);
  });

  it("only hubAdmin can addForbiddenTld", async () => {
    const [hubAdmin, user1, user2, user3, factory] = await ethers.getSigners();

    await picardyDomainHub.init(factory.address, forbiddenTlds.address);

    await expect(
      forbiddenTlds.connect(user1).ownerAddForbiddenTld("com")
    ).to.be.rejectedWith(Error);

    await forbiddenTlds.ownerAddForbiddenTld("com");
  });

  it("Factory address can add forbidden tld", async () => {
    const [hubAdmin, user1, user2, user3, factory] = await ethers.getSigners();

    await picardyDomainHub.init(factory.address, forbiddenTlds.address);

    await forbiddenTlds.addFactoryAddress(factory.address);

    await expect(
      forbiddenTlds.connect(user1).addForbiddenTld("com")
    ).to.be.rejectedWith(Error);

    await forbiddenTlds.connect(factory).addForbiddenTld("com");
  });

  it("users can check isForbiddenTld", async () => {
    const [hubAdmin, user1, user2, user3, factory] = await ethers.getSigners();

    await picardyDomainHub.init(factory.address, forbiddenTlds.address);

    await forbiddenTlds.addFactoryAddress(factory.address);

    await forbiddenTlds.connect(factory).addForbiddenTld("com");

    expect(await forbiddenTlds.isTldForbidden("com")).to.be.true;
    expect(await forbiddenTlds.isTldForbidden("net")).to.be.false;
  });

  it("only hubAdmin can removeForbiddenTld", async () => {
    const [hubAdmin, user1, user2, user3, factory] = await ethers.getSigners();

    await picardyDomainHub.init(factory.address, forbiddenTlds.address);

    await forbiddenTlds.addFactoryAddress(factory.address);

    await forbiddenTlds.connect(factory).addForbiddenTld("com");

    await expect(
      forbiddenTlds.connect(user1).removeForbiddenTld("com")
    ).to.be.rejectedWith(Error);

    await forbiddenTlds.removeForbiddenTld("com");
  });

  it("only hubadmin can withdrawETH", async () => {
    const [hubAdmin, user1, user2, user3, factory] = await ethers.getSigners();

    await picardyDomainHub.init(factory.address, forbiddenTlds.address);

    await expect(forbiddenTlds.connect(user1).withdrawETH()).to.be.rejectedWith(
      Error
    );

    await forbiddenTlds.withdrawETH();
  });
});
