
const ethers = require("ethers")
const cliProgress = require('cli-progress');
const fs = require('fs');


const nodeHttpUrl = process.env.QUICKNODE_URL

const ensAddress = "0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5"
const ensContractAbi = ["function available(string name) view returns (bool)"]
const provider = new ethers.providers.JsonRpcProvider(nodeHttpUrl);
const ensContract = new ethers.Contract(ensAddress, ensContractAbi, provider)

const lettersString = "abcdefghijklmnopqrstuvwxyz"
const letters = lettersString.split("")
const domains = []


function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

; (async () => {


  letters.forEach(letter => {
    letters.forEach(letter2 => {
      letters.forEach(letter3 => {
        // letters.forEach(letter4 => {
        domains.push(`${letter}${letter2}${letter3}`)
        // })
      })
    })
  })
  const total = domains.length
  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  // start the progress bar with a total value of 200 and start value of 0
  bar.start(total, 0);

  // update the current value in your application..


  // stop the progress bar
  let numberofResults = 0
  const promises = domains.map(async (domain, index) => {
    await sleep(index * 5);
    bar.update(++numberofResults);
    return await ensContract.available(domain)
      .then(res => ({ domain, isAvailable: res, didFail: false }))
      .catch(err => ({ domain, isAvailable: false, didFail: true }))
  })

  const results = await Promise.all(promises)
  const fails = results.filter(res => res.didFail)
  const responses = results.filter(res => !res.didFail)
  const onlyAvailableDomains = responses.filter(res => res.isAvailable)
  bar.stop();
  console.log(fails.length, responses.length)
  console.log(onlyAvailableDomains)
  fs.writeFileSync("./results.json", JSON.stringify(onlyAvailableDomains))

})()