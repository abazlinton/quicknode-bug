const ethers = require("ethers")
const cliProgress = require('cli-progress');
const fs = require('fs');
const fiveLetterWords = fs.readFileSync('five.json')


const nodeHttpUrl = process.env.QUICKNODE_URL

const ensAddress = "0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5"
const ensContractAbi = ["function available(string name) view returns (bool)"]
const provider = new ethers.providers.JsonRpcProvider(nodeHttpUrl);
const ensContract = new ethers.Contract(ensAddress, ensContractAbi, provider)


const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
bar.start(fiveLetterWords.length, 0);
let numberofResults = 0
const promises = fiveLetterWords.slice(0, 100).map(async (domain, index) => {
  await sleep(index * 5);
  bar.update(++numberofResults);
  return await ensContract.available(domain)
    .then(res => ({ domain, isAvailable: res, didFail: false }))
    .catch(err => {
      console.log(err)
      return { domain, isAvailable: false, didFail: true }
    })
})

const results = await Promise.all(promises)
const fails = results.filter(res => res.didFail)
console.log("fails:", fails.length)
const responses = results.filter(res => !res.didFail)
const onlyAvailableDomains = responses.filter(res => res.isAvailable)
const onlyDomainNames = onlyAvailableDomains.map(d => d.domain)
console.dir(onlyDomainNames, { maxArrayLength: null })
fs.writeFileSync("./freefive.json", JSON.stringify(onlyDomainNames))