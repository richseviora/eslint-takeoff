#!/usr/bin/env node

const program = require("caporal");
const builder = require("../build/index").execute;

// noinspection BadExpressionStatementJS
program
  .version("0.0.1")
  .description("Generates an exception list and adds it to your .eslintrc.yml file")
  .option("-o --off", "To do list items are listed as off instead of warnings", program.BOOL, false)
  .action((args, options) => {
    const level = options.off ? "off" : "warn";
    builder(level);
  });

program.parse(process.argv);
