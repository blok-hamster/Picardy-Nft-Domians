const { assert, expect } = require("chai");
const chai = require("chai");
const { ethers } = require("hardhat");
chai.use(require("chai-as-promised"));

describe("Picardy Domain test", function () {
  let picardyDomainHub;
  let metadataContract;
  let forbiddenTlds;
  let picardyDomainFactory;
  let picardyDomain;

  let name = ".test";
  let symbol = "TST";
  let cost = ethers.utils.parseEther("1.0");
  let domainPrice = ethers.utils.parseEther("1.0");
  let domainAddress;
  let domainName;
  let royaltyAddress = "0xdafea492d9c6733ae3d56b7ed1adb60692c98bc5";

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

  it("users should mint domain", async () => {
    const [admin, user1, user2] = await ethers.getSigners();

    await picardyDomainFactory.createTld(
      name,
      symbol,
      user1.address,
      domainPrice,
      true,
      {
        value: cost,
      }
    );
    domainAddress = await picardyDomainFactory.getTldAddress(name);

    domainName = await picardyDomainFactory.getTldName(domainAddress);

    picardyDomain = await ethers.getContractAt("PicardyDomain", domainAddress);

    await picardyDomain
      .connect(user1)
      .mint("user1name", user1.address, { value: domainPrice });
  });

  it("Holder can burn", async () => {
    const [admin, user1, user2] = await ethers.getSigners();

    await picardyDomainFactory.createTld(
      name,
      symbol,
      user1.address,
      domainPrice,
      true,
      {
        value: cost,
      }
    );
    domainAddress = await picardyDomainFactory.getTldAddress(name);

    domainName = await picardyDomainFactory.getTldName(domainAddress);

    picardyDomain = await ethers.getContractAt("PicardyDomain", domainAddress);

    await picardyDomain
      .connect(user1)
      .mint("user1name", user1.address, { value: domainPrice });

    await expect(
      picardyDomain.connect(user2).burn("user1name")
    ).to.be.rejectedWith(Error);

    await picardyDomain.connect(user1).burn("user1name");
  });

  it("holder can edit default domain", async () => {
    const [admin, user1, user2] = await ethers.getSigners();

    await picardyDomainFactory.createTld(
      name,
      symbol,
      user1.address,
      domainPrice,
      true,
      {
        value: cost,
      }
    );
    domainAddress = await picardyDomainFactory.getTldAddress(name);

    domainName = await picardyDomainFactory.getTldName(domainAddress);

    picardyDomain = await ethers.getContractAt("PicardyDomain", domainAddress);

    await picardyDomain
      .connect(user1)
      .mint("user1name", user1.address, { value: domainPrice });

    await picardyDomain
      .connect(user1)
      .mint("newUser1Name", user1.address, { value: domainPrice });

    await expect(
      picardyDomain.connect(user2).editDefaultDomain("newUser1Name")
    ).to.be.rejectedWith(Error);

    await picardyDomain.connect(user1).editDefaultDomain("newUser1Name");
  });

  it("only domain holder can editData", async () => {
    const [admin, user1, user2] = await ethers.getSigners();

    await picardyDomainFactory.createTld(
      name,
      symbol,
      user1.address,
      domainPrice,
      true,
      {
        value: cost,
      }
    );
    domainAddress = await picardyDomainFactory.getTldAddress(name);

    domainName = await picardyDomainFactory.getTldName(domainAddress);

    picardyDomain = await ethers.getContractAt("PicardyDomain", domainAddress);

    await picardyDomain
      .connect(user1)
      .mint("user1name", user1.address, { value: domainPrice });

    await expect(
      picardyDomain
        .connect(user2)
        .editData("user1name", "{name: arch, twitter: @blok_hamster}")
    ).to.be.rejectedWith(Error);

    await picardyDomain
      .connect(user1)
      .editData("user1name", "{name: arch, twitter: @blok_hamster}");
  });

  it("only owner can change meta data address", async () => {
    const [admin, user1, user2] = await ethers.getSigners();

    await picardyDomainFactory.createTld(
      name,
      symbol,
      user1.address,
      domainPrice,
      true,
      {
        value: cost,
      }
    );
    domainAddress = await picardyDomainFactory.getTldAddress(name);

    domainName = await picardyDomainFactory.getTldName(domainAddress);

    picardyDomain = await ethers.getContractAt("PicardyDomain", domainAddress);

    await picardyDomain
      .connect(user1)
      .mint("user1name", user1.address, { value: domainPrice });

    await expect(
      picardyDomain.connect(user2).changeMetadataAddress(user2.address)
    ).to.be.rejectedWith(Error);

    await picardyDomain
      .connect(user1)
      .changeMetadataAddress(metadataContract.address);
  });

  it("only owner can change minter", async () => {
    const [admin, user1, user2, user3] = await ethers.getSigners();

    await picardyDomainFactory.createTld(
      name,
      symbol,
      user1.address,
      domainPrice,
      true,
      {
        value: cost,
      }
    );
    domainAddress = await picardyDomainFactory.getTldAddress(name);

    domainName = await picardyDomainFactory.getTldName(domainAddress);

    picardyDomain = await ethers.getContractAt("PicardyDomain", domainAddress);

    await picardyDomain
      .connect(user1)
      .mint("user1name", user1.address, { value: domainPrice });

    await expect(
      picardyDomain.connect(user2).changeMinter(user2.address)
    ).to.be.rejectedWith(Error);

    await picardyDomain.connect(user1).changeMinter(user2.address);

    await picardyDomain.connect(user1).toggleBuyingDomains();

    await picardyDomain
      .connect(user2)
      .mint("user2name", user2.address, { value: domainPrice });

    await expect(
      picardyDomain
        .connect(user3)
        .mint("user3name", user3.address, { value: domainPrice })
    ).to.be.rejectedWith(Error);
  });

  it("only owner can change nameMaxLength", async () => {
    const [admin, user1, user2] = await ethers.getSigners();

    await picardyDomainFactory.createTld(
      name,
      symbol,
      user1.address,
      domainPrice,
      true,
      {
        value: cost,
      }
    );
    domainAddress = await picardyDomainFactory.getTldAddress(name);

    domainName = await picardyDomainFactory.getTldName(domainAddress);

    picardyDomain = await ethers.getContractAt("PicardyDomain", domainAddress);

    await picardyDomain
      .connect(user1)
      .mint("user1name", user1.address, { value: domainPrice });

    await expect(
      picardyDomain.connect(user2).changeNameMaxLength(10)
    ).to.be.rejectedWith(Error);

    await picardyDomain.connect(user1).changeNameMaxLength(10);
  });

  it("only owner can change price", async () => {
    const [admin, user1, user2] = await ethers.getSigners();

    await picardyDomainFactory.createTld(
      name,
      symbol,
      user1.address,
      domainPrice,
      true,
      {
        value: cost,
      }
    );
    domainAddress = await picardyDomainFactory.getTldAddress(name);

    domainName = await picardyDomainFactory.getTldName(domainAddress);

    picardyDomain = await ethers.getContractAt("PicardyDomain", domainAddress);

    await picardyDomain
      .connect(user1)
      .mint("user1name", user1.address, { value: domainPrice });

    await expect(
      picardyDomain.connect(user2).changePrice(domainPrice)
    ).to.be.rejectedWith(Error);

    await picardyDomain.connect(user1).changePrice(domainPrice);
  });

  it("only owner can disable forever", async () => {
    const [admin, user1, user2] = await ethers.getSigners();

    await picardyDomainFactory.createTld(
      name,
      symbol,
      user1.address,
      domainPrice,
      true,
      {
        value: cost,
      }
    );
    domainAddress = await picardyDomainFactory.getTldAddress(name);

    domainName = await picardyDomainFactory.getTldName(domainAddress);

    picardyDomain = await ethers.getContractAt("PicardyDomain", domainAddress);

    await picardyDomain
      .connect(user1)
      .mint("user1name", user1.address, { value: domainPrice });

    await expect(
      picardyDomain.connect(user2).disableBuyingForever()
    ).to.be.rejectedWith(Error);

    await picardyDomain.connect(user1).disableBuyingForever();

    await expect(
      picardyDomain
        .connect(user2)
        .mint("user2name", user2.address, { value: domainPrice })
    ).to.be.rejectedWith(Error);
  });

  it("only owner can freezeMetadata", async () => {
    const [admin, user1, user2] = await ethers.getSigners();

    await picardyDomainFactory.createTld(
      name,
      symbol,
      user1.address,
      domainPrice,
      true,
      {
        value: cost,
      }
    );
    domainAddress = await picardyDomainFactory.getTldAddress(name);

    domainName = await picardyDomainFactory.getTldName(domainAddress);

    picardyDomain = await ethers.getContractAt("PicardyDomain", domainAddress);

    await picardyDomain
      .connect(user1)
      .mint("user1name", user1.address, { value: domainPrice });

    await expect(
      picardyDomain.connect(user2).freezeMetadata()
    ).to.be.rejectedWith(Error);

    await picardyDomain.connect(user1).freezeMetadata();

    await expect(
      picardyDomain
        .connect(user1)
        .changeMetadataAddress(metadataContract.address)
    ).to.be.rejectedWith(Error);
  });

  it("only owner can withdraw ETH", async () => {
    const [admin, user1, user2] = await ethers.getSigners();

    await picardyDomainFactory.createTld(
      name,
      symbol,
      user1.address,
      domainPrice,
      true,
      {
        value: cost,
      }
    );
    domainAddress = await picardyDomainFactory.getTldAddress(name);

    domainName = await picardyDomainFactory.getTldName(domainAddress);

    picardyDomain = await ethers.getContractAt("PicardyDomain", domainAddress);

    await picardyDomain
      .connect(user1)
      .mint("user1name", user1.address, { value: domainPrice });

    await expect(picardyDomain.connect(user2).withdrawETH()).to.be.rejectedWith(
      Error
    );

    await picardyDomain.connect(user1).withdrawETH();
  });
});
