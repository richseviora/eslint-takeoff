import { LintReport, LintMessage, LintResult } from "eslint";
import { RuleAggregated, LintTransformed, OverrideOutput } from "./models";
import * as _ from "lodash";
import { relative } from "path";

export function reportToRuleGroups(report: LintReport): RuleAggregated[] {
  const parserGenerator = (filePath: string) => {
    return (message: LintMessage): LintTransformed => ({
      ruleId: message.ruleId,
      filePath,
    });
  };
  const resultParser = (result: LintResult) => {
    return _.uniqBy(
      result.messages.map(parserGenerator(result.filePath)),
      obj => {
        console.info("Result Parser: ", obj);
        return JSON.stringify(obj);
      },
    ) as LintTransformed[];
  };
  const nestedResults = report.results.map(resultParser);
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
  return baseTransformation;
}

export function ruleGroupsToOverride(
  aggregate: RuleAggregated[],
): OverrideOutput[] {
    const sortedRules = _.sortBy(aggregate, "rule");
  return _.map(sortedRules, (ruleAggregate: RuleAggregated): OverrideOutput => {
    return {
      rules: {
        [ruleAggregate.rule]: 0,
      },
      files: ruleAggregate.filePaths,
    };
  });
}
