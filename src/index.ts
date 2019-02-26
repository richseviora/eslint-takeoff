import { CLIEngine, Level, LintReport } from "eslint";
import { reportToRuleGroups, ruleGroupsToOverride } from "./ruleGrouping";
import { reportToFileGroup, fileGroupsToOverride } from "./fileGrouping";
import * as fs from "fs";
import * as YAML from "yamljs";
import * as _ from "lodash";
import { renderAsYAML } from "./renderer";

function loadYAML<T = any>(path: string): T {
  return YAML.parse(fs.readFileSync(path, "utf8"));
}

function getNewConfig(baseConfig: any): any {
  const newExtend = _.uniq([".eslintrc-todo.yml", ...baseConfig.extends]).reverse();
  return {
    ...baseConfig,
    extends: newExtend,
  };
}

export const execute = (level: Level) => {
  const baseConfig = loadYAML(".eslintrc.yml");
  const newLint = new CLIEngine({
    useEslintrc: false,
    baseConfig,
  });
  const result = newLint.executeOnFiles(["."]) as LintReport;
  const baseTransformation = reportToFileGroup(result);
  const overrides = fileGroupsToOverride(baseTransformation, level);
  const updatedBaseConfig = getNewConfig(baseConfig);
  const updatedBaseYAML = renderAsYAML(updatedBaseConfig, false);
  const newToDoListConfig = renderAsYAML({ overrides }, true);
  fs.writeFileSync(".eslintrc-todo.yml", newToDoListConfig, { encoding: "utf8" });
  fs.writeFileSync(".eslintrc.yml", updatedBaseYAML, { encoding: "utf-8" });
};
