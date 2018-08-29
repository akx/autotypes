const path = require("path");
const util = require("util");
const fs = require("fs");

const readFileP = util.promisify(fs.readFile);

function getDepsFromPackageJSONData(packageJsonData) {
  const deps = [];
  Object.keys(packageJsonData.dependencies || {}).forEach(name => {
    deps.push({ name, type: "dep" });
  });
  Object.keys(packageJsonData.devDependencies || {}).forEach(name => {
    deps.push({ name, type: "dev" });
  });
  return deps;
}

async function getDepsFromDirectory(dir) {
  const packageJsonFile = path.join(dir, "package.json");
  const packageJsonStr = await readFileP(packageJsonFile, "UTF-8");
  const packageJsonData = JSON.parse(packageJsonStr);
  return getDepsFromPackageJSONData(packageJsonData);
}

module.exports.fromDirectory = getDepsFromDirectory;
module.exports.fromPackageJSONData = getDepsFromPackageJSONData;
