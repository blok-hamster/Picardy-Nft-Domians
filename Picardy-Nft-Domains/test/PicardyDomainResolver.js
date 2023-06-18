const { assert, expect } = require("chai");
const chai = require("chai");
const { ethers, upgrades } = require("hardhat");
chai.use(require("chai-as-promised"));

describe("Picardy resolver test", function () {
  let picardyDomainHub;
  let metadataContract;
  let forbiddenTlds;
  let picardyDomainFactory;
  let picardyDomain;
  let domainResolver;

  let name = ".test";
  let name2 = ".test2";

  let domainPrice = ethers.utils.parseEther("1.0");
  let symbol = "TST";
  let symbol2 = "TST2";
  let royaltyAddress = "0xdafea492d9c6733ae3d56b7ed1adb60692c98bc5";

  let cost = ethers.utils.parseEther("1.0");

  beforeEach(async () => {
    const [admin, user1, user2] = await ethers.getSigners();
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

    const PicardyDomaiResolver = await ethers.getContractFactory(
      "PicardyDomainResolver"
    );

    domainResolver = await await upgrades.deployProxy(
      PicardyDomaiResolver,
      [picardyDomainHub.address],
      { initializer: "initialize" }
    );

    domainResolver.addFactoryAddress(picardyDomainFactory.address);

    forbiddenTlds.addFactoryAddress(picardyDomainFactory.address);

    picardyDomainFactory.toggleBuyingTlds();

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
      .editData("user1name", "{name: arch, twitter: @blok_hamster}");

    await picardyDomain
      .connect(user2)
      .mint("user2name", user2.address, { value: domainPrice });

    await picardyDomain
      .connect(user2)
      .editData("user2name", "{name: oracle, twitter: @pixelotic}");
  });

  it("only hubadmin should update hubaddress", async () => {
    const [admin, user1, user2] = await ethers.getSigners();
    await expect(
      domainResolver.connect(user1).updateHubAddress(user1.address)
    ).to.be.rejectedWith(Error);

    await domainResolver.updateHubAddress(picardyDomainHub.address);
  });

  it("get default domain", async () => {
    const [admin, user1, user2] = await ethers.getSigners();
    expect(
      await domainResolver.getDefaultDomain(user1.address, ".test")
    ).to.be.equal("user1name");
  });

  it("get default domains", async () => {
    const [admin, user1, user2] = await ethers.getSigners();
    expect(
      await domainResolver.getDefaultDomains(user1.address)
    ).to.be.deep.equal("user1name.test");
  });

  it("get domain holder", async () => {
    const [admin, user1, user2] = await ethers.getSigners();
    expect(
      await domainResolver.getDomainHolder("user1name", ".test")
    ).to.be.deep.equal(user1.address);
  });

  it("get domain data", async () => {
    const [admin, user1, user2] = await ethers.getSigners();
    expect(
      await domainResolver.getDomainData("user1name", ".test")
    ).to.be.deep.equal("{name: arch, twitter: @blok_hamster}");
  });

  it("get domain token uri", async () => {
    const [admin, user1, user2] = await ethers.getSigners();
    const tokenUri = await domainResolver.getDomainTokenUri(
      "user1name",
      ".test"
    );
    //console.log(tokenUri);
  });

  it("get factory array", async () => {
    const [admin, user1, user2] = await ethers.getSigners();
    const factories = await domainResolver.getFactoriesArray();
    expect(factories[0]).to.be.equal(picardyDomainFactory.address);
  });

  it("get first deafault domain", async () => {
    const [admin, user1, user2] = await ethers.getSigners();
    expect(
      await domainResolver.getFirstDefaultDomain(user1.address)
    ).to.be.equal("user1name.test");
  });

  it("get tld address", async () => {
    const [admin, user1, user2] = await ethers.getSigners();
    expect(await domainResolver.getTldAddress(".test")).to.be.equal(
      picardyDomain.address
    );
  });

  it("get tld factoryAddress", async () => {
    const [admin, user1, user2] = await ethers.getSigners();
    expect(await domainResolver.getTldFactoryAddress(".test")).to.be.equal(
      picardyDomainFactory.address
    );
  });

  it("only hubAdmin add depricated tld address", async () => {
    const [admin, user1, user2] = await ethers.getSigners();
    await expect(
      domainResolver
        .connect(user1)
        .addDeprecatedTldAddress(picardyDomain.address)
    ).to.be.rejectedWith(Error);
    await domainResolver.addDeprecatedTldAddress(picardyDomain.address);
    await expect(
      domainResolver
        .connect(user1)
        .removeDeprecatedTldAddress(picardyDomain.address)
    ).to.be.rejectedWith(Error);
    await domainResolver.removeDeprecatedTldAddress(picardyDomain.address);
  });

  it("only hubadmin can remove factory address", async () => {
    const [admin, user1, user2] = await ethers.getSigners();
    await expect(
      domainResolver.connect(user1).removeFactoryAddress(0)
    ).to.be.rejectedWith(Error);

    await domainResolver.removeFactoryAddress(0);
  });
});
