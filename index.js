const parseArgv = require("minimist");
const readPackages = require("./lib/read-packages");
const findTypes = require("./lib/find-types-packages");

const progressCallback = d => {
  process.stderr.write(
    `=> ${d.remaining} packages remaining...`.padEnd(40) + "\r"
  );
  if (d.remaining === 0) {
    process.stderr.write("\n");
  }
};

const USAGE = `
Usage: autotypes [flags] <directory-with-package.json>

Flags:
--dev, --include-dev: also consider devDependencies?
--already-typed: also consider packages which already have @types/ installed
`;

const parseSettings = (argv = process.argv.slice(2)) => {
  const settings = {
    path: null,
    includeDev: false,
    includeAlreadyTyped: false
  };
  const args = parseArgv(argv, {
    boolean: ["dev", "already-typed"],
    alias: {
      dev: "include-dev",
      "already-typed": "alreadyTyped"
    }
  });
  const path = args._[0];
  if (!path) {
    console.error(USAGE);
    process.exit(1);
  }
  return {
    path,
    includeAlreadyTyped: !!args["already-typed"],
    includeDev: !!args["dev"]
  };
};

function filterPackages(settings, packages) {
  const typesPackages = new Set(
    packages
      .filter(spec => spec.name.startsWith("@types"))
      .map(spec => spec.name)
  );
  return packages.filter(spec => {
    if (spec.name.startsWith("@types")) {
      return false;
    }
    if (spec.type === "dev" && !settings.includeDev) {
      return false;
    }
    if (
      !settings.includeAlreadyTyped &&
      typesPackages.has(`@types/${spec.name}`)
    ) {
      return false;
    }
    return true;
  });
}

(async function(argv) {
  const settings = parseSettings(argv);
  const packages = filterPackages(
    settings,
    await readPackages.fromDirectory(settings.path)
  );
  const results = await findTypes(packages, progressCallback);
  results.forEach(res => {
    if (res.found && !res.isStub) {
      console.log(res.name);
    }
  });
})();
