const minimist = require('minimist');
const readPackages = require('./lib/read-packages');
const findTypes = require('./lib/find-types-packages');

const progressCallback = (d) => {
	process.stderr.write(`=> ${d.remaining} packages remaining...`.padEnd(40) + '\r');
	if(d.remaining === 0) {
		process.stderr.write('\n');
	}
};

(async function (argv) {
	const pth = argv._[0];
	if(!pth) {
		console.error(`Usage: ${process.argv[1]} <directory-with-package.json>`);
		process.exit(1);
	}
	const devToo = (argv.dev === undefined || argv.dev === true);
	const packages = (await readPackages(pth)).filter(spec => {
		if(spec.name.startsWith('@types')) return false;
		if(spec.type === 'dev' && !devToo) return false;
		return true;
	});
	const results = await findTypes(packages, progressCallback);
	results.forEach((res) => {
		if(res.found && !res.isStub) {
			console.log(res.name);
		}
	});
}(minimist(process.argv.slice(2))));
