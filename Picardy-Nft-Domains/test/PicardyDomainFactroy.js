const { assert, expect } = require("chai");
const chai = require("chai");
const { ethers } = require("hardhat");
chai.use(require("chai-as-promised"));

describe("PicardyNftDomainFactory", function () {
  let picardyDomainHub;
  let metadataContract;
  let forbiddenTlds;
  let picardyDomainFactory;

  let name = ".test";
  let name2 = ".test2";

  let domainPrice = ethers.utils.parseEther("1.0");
  let symbol = "TST";
  let symbol2 = "TST2";
  let royaltyAddress = "0xdafea492d9c6733ae3d56b7ed1adb60692c98bc5";

  let cost = ethers.utils.parseEther("1.0");
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

    //import factory
    const DomainImageContract = await ethers.getContractFactory(
      "DomainImageContract"
    );
    let domainImageContract = await DomainImageContract.deploy();
    const PicardyDomainFactory = await ethers.getContractFactory(
      "PicardyDomainFactoryV2"
    );
    picardyDomainFactory = await PicardyDomainFactory.deploy(
      cost,
      forbiddenTlds.address,
      metadataContract.address,
      picardyDomainHub.address,
      royaltyAddress,
      domainImageContract.address
    );

    forbiddenTlds.addFactoryAddress(picardyDomainFactory.address);

    picardyDomainFactory.toggleBuyingTlds();
  });

  it("user can create domain & update description", async () => {
    const [hubAdmin, user1, user2, user3] = await ethers.getSigners();
    await picardyDomainFactory
      .connect(user1)
      .createTld(name, symbol, user1.address, domainPrice, true, {
        value: cost,
      });
    let domainAddress = await picardyDomainFactory
      .connect(user1)
      .getTldAddress(name);

    let domainName = await picardyDomainFactory
      .connect(user1)
      .getTldName(domainAddress);
    expect(domainName).to.equal(name);

    await expect(
      metadataContract
        .connect(user2)
        .changeDescription(domainAddress, "test domain")
    ).to.be.rejectedWith(Error);

    await metadataContract
      .connect(user1)
      .changeDescription(domainAddress, "test domain");
  });

  it("only HubAdmin can change forbidden tld address", async () => {
    const [hubAdmin, user1, user2, user3] = await ethers.getSigners();
    await expect(
      picardyDomainFactory
        .connect(user1)
        .changeForbiddenTldsAddress(user1.address)
    ).to.be.rejectedWith(Error);

    await picardyDomainFactory.changeForbiddenTldsAddress(
      forbiddenTlds.address
    );
  });

  it("only hubAdmin can change metadataAddress", async () => {
    const [hubAdmin, user1, user2, user3] = await ethers.getSigners();
    await expect(
      picardyDomainFactory.connect(user1).changeMetadataAddress(user1.address)
    ).to.be.rejectedWith(Error);

    await picardyDomainFactory.changeMetadataAddress(metadataContract.address);
  });

  it("only hub admin ca changeNameMaxLength", async () => {
    const [hubAdmin, user1, user2, user3] = await ethers.getSigners();
    await expect(
      picardyDomainFactory.connect(user1).changeNameMaxLength(10)
    ).to.be.rejectedWith(Error);

    await picardyDomainFactory.changeNameMaxLength(10);
  });

  it("only hub admin can change domain price", async () => {
    const [hubAdmin, user1, user2, user3] = await ethers.getSigners();
    await expect(
      picardyDomainFactory
        .connect(user1)
        .changePrice(ethers.utils.parseEther("2.0"))
    ).to.be.rejectedWith(Error);

    await picardyDomainFactory.changePrice(ethers.utils.parseEther("2.0"));
  });

  it("only admin can change royalty", async () => {
    const [hubAdmin, user1, user2, user3] = await ethers.getSigners();
    await expect(
      picardyDomainFactory.connect(user1).changeRoyalty(20)
    ).to.be.rejectedWith(Error);

    await picardyDomainFactory.changeRoyalty(20);
  });

  it("only hub admin can call ownerCreateTld", async () => {
    const [hubAdmin, user1, user2, user3] = await ethers.getSigners();

    await expect(
      picardyDomainFactory.connect(user1).toggleBuyingTlds()
    ).to.be.rejectedWith(Error);

    await picardyDomainFactory.toggleBuyingTlds();

    await expect(
      picardyDomainFactory
        .connect(user1)
        .ownerCreateTld(name, symbol, user1.address, domainPrice, true)
    ).to.be.rejectedWith(Error);

    await picardyDomainFactory.ownerCreateTld(
      name,
      symbol,
      user1.address,
      domainPrice,
      true
    );
  });

  it("only hubadmin can withdraw eth", async () => {
    const [hubAdmin, user1, user2, user3] = await ethers.getSigners();

    await picardyDomainFactory
      .connect(user1)
      .createTld(name, symbol, user1.address, domainPrice, true, {
        value: cost,
      });

    await picardyDomainFactory
      .connect(user2)
      .createTld(name2, symbol2, user2.address, domainPrice, true, {
        value: cost,
      });

    await expect(
      picardyDomainFactory.connect(user1).withdrawETH()
    ).to.be.rejectedWith(Error);

    await picardyDomainFactory.withdrawETH();
  });
});
