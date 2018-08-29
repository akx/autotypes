autotypes
=========

Finds non-stub `@types/` packages for your package.json.

Usage
-----

```
cd my_project
# list all non-devDependencies @types/ packages available
node ~/autotypes
# `yarn add` the same
node ~/autotypes | xargs yarn add
# `npm install --save` the same
node ~/autotypes | xargs npm install --save
```
