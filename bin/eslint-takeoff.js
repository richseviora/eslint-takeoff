#!/usr/bin/env node

const program = require("caporal");
const builder = require("../build/index").execute;

// noinspection BadExpressionStatementJS
program
  .version("0.0.1")
  .description("Generates an exception list and adds it to your .eslintrc.yml file")
  .option("-w --warn", "Generate warnings only", program.BOOL, false)
  .action((args, options) => {
    const level = options.warn ? "warn" : "off";
    builder(level);
  });

program.parse(process.argv);
