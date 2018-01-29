import { CLIEngine, LintReport, LintResult, LintMessage } from "eslint";
import { relative } from "path";
import * as fs from "fs";
import * as YAML from "yamljs";
import * as _ from "lodash";

const newLint = new CLIEngine({
  allowInlineConfig: false,
});

interface LintTransformed {
  ruleId: string;
  filePath: string;
}

interface RuleAggregated {
  rule: string;
  filePaths: string[];
}

interface OverrideOutput {
  rules: Map<string, number>;
  files: string[];
}

const result = newLint.executeOnFiles(["."]) as LintReport;

const parserGenerator = (filePath: string) => {
  return (message: LintMessage): LintTransformed => ({
    ruleId: message.ruleId,
    filePath,
  });
};
const resultParser = (result: LintResult) => {
  return _.uniqBy(result.messages.map(parserGenerator(result.filePath)), obj =>
  {
    console.info("Result Parser: ",obj);
    return JSON.stringify(obj);
  }
  ) as LintTransformed[];
};
const nestedResults = result.results.map(resultParser);
const flattenedResults = _.flatten(nestedResults) as LintTransformed[];
const groupedByRule = _.groupBy(flattenedResults, "ruleId");
const baseTransformation = _.map(
  groupedByRule,
  (value: LintTransformed[], rule: string) => {
    return {
      rule,
      filePaths: _.map(value, item => item.filePath).map(path =>
        relative(process.cwd(), path),
      ),
    };
  },
) as RuleAggregated[];
const sortedRules = _.sortBy(baseTransformation, "rule");
const transformToOverrides = _.map(
  sortedRules,
  (ruleAggregate: RuleAggregated): OverrideOutput => {
    return {
      rules: {
        [ruleAggregate.rule]: 0,
      },
      files: ruleAggregate.filePaths,
    };
  },
);

function loadYAML<T = any>(path: string): T {
  return YAML.parse(fs.readFileSync(path, "utf8"));
}

function outputToYaml(object: any): string {
  return YAML.stringify(object, 10, 2);
}

function getNewConfig(object: any): any {
  const newExtend = _.uniq([
    "./.eslintrc-todo.yml",
    ...object.extends,
  ]).reverse();
  return {
    ...baseConfig,
    extends: newExtend,
  };
}

const baseConfig = loadYAML(".eslintrc.yml");
const updatedBaseConfig = getNewConfig(baseConfig);
const updatedBaseYAML = outputToYaml(updatedBaseConfig);
const newToDoListConfig = outputToYaml({ overrides: transformToOverrides });
fs.writeFileSync(".eslintrc-todo.yml", newToDoListConfig, { encoding: "utf8" });
fs.writeFileSync(".eslintrc.yml", updatedBaseYAML, { encoding: "utf-8" });
