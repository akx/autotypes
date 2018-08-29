autotypes
=========

Finds non-stub `@types/` packages for your package.json.

Usage
-----

```
cd my_project
# list all non-devDependencies @types/ packages available
node ~/autotypes --no-dev
# `yarn add` the same
node ~/autotypes --no-dev | xargs yarn add
# `npm install --save` the same
node ~/autotypes --no-dev | xargs npm install --save
```
