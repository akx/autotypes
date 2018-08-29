const fetch = require('node-fetch');
const pcon = require('./promise-concurrency');

async function findTypesPackage(spec) {
  const typesPkgName = `@types/${spec.name}`;
  const url = `https://registry.npmjs.org/${encodeURIComponent(typesPkgName)}`;
  const res = await fetch(url);
  if (res.status === 404) {
    return {spec, name: typesPkgName, found: false};
  }
  const json = await res.json();
  const isStub = (json.description.indexOf('Stub TypeScript definitions') === 0);
  return {spec, name: typesPkgName, found: true, doc: json, isStub};
}

module.exports = function(packageSpecs, progressCallback=undefined) {
  return pcon(packageSpecs, 5, findTypesPackage, progressCallback);
};