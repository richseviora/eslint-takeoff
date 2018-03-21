# eslint-takeoff
Utility that auto-generates ESLint todo-lists for an existing code base.

# Installation

```
npm install --save-dev eslint-takeoff
yarn add -D eslint-takeoff
```

# Usage

Run from project root with an `.eslintrc.yml` file:
```
npx eslint-takeoff
yarn eslint-takeoff
```

## Options

Accepts the following options:

 Option | Name
--- | ---
 -o, -off | Creates the todo list with rules set to `off` instead of `warn`.


Currently compatible with projects with rules configured in `.eslintrc.yml` only.


# Development

Yarn is required, as is Node 8+:

* Yarn 1.5.2
* Node 8.9.4+
* Typescript 2.6+


