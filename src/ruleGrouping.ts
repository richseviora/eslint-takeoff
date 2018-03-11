import { LintReport, LintMessage, LintResult, Level } from "eslint";
import { RuleAggregated, LintTransformed, OverrideOutput } from "./models";
import * as _ from "lodash";
import { relative } from "path";

const overrideMapGenerator = (warningLevel: Level) => {
  return (ruleAggregate: RuleAggregated): OverrideOutput => {
    return {
      rules: {
        [ruleAggregate.rule]: warningLevel,
      },
      files: ruleAggregate.filePaths,
    };
  };
};

const parserGenerator = (filePath: string) => {
  return (message: LintMessage): LintTransformed => ({
    ruleId: message.ruleId,
    filePath,
  });
};

const resultParser = (result: LintResult) => {
  return _.uniqBy(result.messages.map(parserGenerator(result.filePath)), obj =>
    JSON.stringify(obj),
  ) as LintTransformed[];
};

export function reportToRuleGroups(report: LintReport): RuleAggregated[] {
  const nestedResults = report.results.map(resultParser);
  const flattenedResults = _.flatten(nestedResults) as LintTransformed[];
  const groupedByRule = _.groupBy(flattenedResults, "ruleId");
  return _.map(groupedByRule, (value: LintTransformed[], rule: string) => {
    return {
      rule,
      filePaths: _.map(value, item => item.filePath).map(path =>
        relative(process.cwd(), path),
      ),
    };
  }) as RuleAggregated[];
}

export function ruleGroupsToOverride(
  aggregate: RuleAggregated[],
  warningLevel: Level,
): OverrideOutput[] {
  const sortedRules = _.sortBy(aggregate, "rule");
  return _.map(sortedRules, overrideMapGenerator(warningLevel));
}
