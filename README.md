autotypes
=========

Finds non-stub `@types/` packages for your package.json.

Usage
-----

```
cd my_project
# list all non-devDependencies @types/ packages available
node ~/autotypes
# `yarn add` the same to devDependencies
node ~/autotypes | xargs yarn add --dev
# `npm install --save` the same to devDependencies
node ~/autotypes | xargs npm install --save-dev
```
