"use strict";

const path = require("path");
const isLocal = typeof process.pkg === "undefined";
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
const { NETWORK } = require(path.join(basePath, "constants/network.js"));
const fs = require("fs");

console.log(path.join(basePath, "/src/config.js"));
const {
  baseUri,
  baseHiddenUri,
  description,
  namePrefix,
  network,
  solanaMetadata,
} = require(path.join(basePath, "/src/config.js"));

// read json data
let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
let data = JSON.parse(rawdata);

data.forEach((item) => {
  if (network == NETWORK.sol) {
    item.name = `${namePrefix} #${item.edition}`;
    item.description = description;
    item.creators = solanaMetadata.creators;
  } else {
    item.name = `${namePrefix} #${item.edition}`;
    item.description = description;
    item.image = `${baseHiddenUri}/hidden.png`;
    delete item["dna"];
    delete item["date"];
    delete item["attributes"];
    delete item["compiler"];
  }
  fs.writeFileSync(
    `${basePath}/build/json/hidden/hidden${item.edition}.json`,
    JSON.stringify(item, null, 2)
  );
});

fs.writeFileSync(
  `${basePath}/build/json/hidden/_metadata.json`,
  JSON.stringify(data, null, 2)
);

if (network == NETWORK.sol) {
  console.log(`Updated description for images to ===> ${description}`);
  console.log(`Updated name prefix for images to ===> ${namePrefix}`);
  console.log(
    `Updated creators for images to ===> ${JSON.stringify(
      solanaMetadata.creators
    )}`
  );
} else {
  console.log(`Updated baseUri for images to ===> ${baseHiddenUri}`);
  console.log(`Updated description for images to ===> ${description}`);
  console.log(`Updated name prefix for images to ===> ${namePrefix}`);
}
