var fs = require('fs');
const util = require('util');
// Run `npm install node-fetch` in the scripts subdirectory.
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const TOTALSUPPLY = 8888;

const downloadFile = (async (url, path) => {
  const res = await fetch(url, { timeout: 10000 });
  const fileStream = fs.createWriteStream(path);
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on("error", reject);
    fileStream.on("finish", resolve);
  });
});

async function doit() {
  for (let i = 1; i <= TOTALSUPPLY; i ++) {
    let filename = "metadata/" + i + ".json";
    while (!fs.existsSync(filename)) {
      let url = "https://ipfs.io/ipfs/bafybeifm5bnzc3oqrbyr6j6r2mmamdrism67k4ozecujv5ln4lgnmuufu4/" + i + ".json";
      console.log(url);
      try {
        await downloadFile(url, filename);
      } catch (e) {
        console.error("Error downloading: " + filename);
      }
    }
  }
}

doit();

console.log(process.cwd());
