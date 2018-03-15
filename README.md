# eslint-takeoff
Utility that auto-generates ESLint todo-lists for an existing code base.

# Installation

Not yet a module, so you need to clone and then install from disk:

```
git clone https://github.com/richseviora/eslint-takeoff
# In your project directory.
npm install --save-dev <path_to_clone>
yarn add -D <path_to_clone>
```

# Usage

Run at the project root with an `.eslintrc.yml` file.

Currently compatible with projects with rules configured in `.eslintrc.yml` only. Other configuration modes (JSON, JS) could be added in the future.

# Development

Yarn is required, as is Node 8+:

* Yarn 1.5.2
* Node 8.9.4+


