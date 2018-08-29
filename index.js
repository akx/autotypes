const minimist = require('minimist');
const readPackages = require('./lib/read-packages');
const findTypes = require('./lib/find-types-packages');

(async function (argv) {
	const pth = argv._[0];
	if(!pth) {
		console.error(`Usage: ${process.argv[1]} <directory-with-package.json>`);
		process.exit(1);
	}
	const packages = (await readPackages(pth)).filter(spec => !spec.name.startsWith('@types'));
	console.log(`# Finding @types for ${packages.length} packages...`);
	const results = await findTypes(packages);
	results.forEach((res) => {
		if(res.found && !res.isStub) {
			console.log(res.name);
		}
	});
}(minimist(process.argv.slice(2))));
