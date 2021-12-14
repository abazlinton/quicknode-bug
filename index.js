const ethers = require("ethers")

const nodeHttpUrl = process.env.QUIKNODE_URL

const ensAddress = "0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5"
const ensContractAbi = ["function available(string name) view returns (bool)"]

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const provider = new ethers.providers.JsonRpcProvider(nodeHttpUrl);
const ensContract = new ethers.Contract(ensAddress, ensContractAbi, provider)

Array.from({ length: 30 }).forEach(async (_, index) => {
  // don't flood quiknode
  await sleep(index * 20);
  try {
    // is the domain blo.eth available?
    const isAvailable = await ensContract.available("blo")
    console.log(isAvailable ? "blo is available to register" : "blo is already registered")
  } catch (error) {
    console.log(error)
  }
})
