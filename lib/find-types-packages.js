const fetch = require("node-fetch");
const pcon = require("./promise-concurrency");

async function findTypesPackage(spec) {
  const urlSpecName = spec.name.startsWith("@")
    ? spec.name.substring(1).replace("/", "__")
    : spec.name;
  const typesPkgName = `@types/${urlSpecName}`;
  const url = `https://registry.npmjs.org/${encodeURIComponent(typesPkgName)}`;
  const res = await fetch(url);
  if (res.status === 404) {
    return { spec, name: typesPkgName, found: false };
  }
  const json = await res.json();
  if (res.status != 200) {
    const err = new Error(`Failed ${typesPkgName}: ${JSON.stringify(json)}`);
    err.res = res;
    throw err;
  }
  const isStub = json.description.indexOf("Stub TypeScript definitions") === 0;
  return { spec, name: typesPkgName, found: true, doc: json, isStub };
}

module.exports = function(packageSpecs, progressCallback = undefined) {
  return pcon(packageSpecs, 5, findTypesPackage, progressCallback);
};
