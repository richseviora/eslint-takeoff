import { Level, LintReport, LintResult } from "eslint";
import * as _ from "lodash";
import { relative } from "path";
import { FileAggregated, OverrideOutput } from "./models";
import { Dictionary } from "lodash";

function stripEmptyFiles(lintResults: LintResult[]): LintResult[] {
  return lintResults.filter(lintResult => lintResult.messages.length > 0);
}

export function reportToFileGroup(report: LintReport): FileAggregated[] {
  return stripEmptyFiles(report.results).map(result => ({
    rules: _.uniq(result.messages.map(msg => msg.ruleId)),
    filePath: result.filePath,
  }));
}

export function fileGroupsToOverride(
  aggregate: FileAggregated[],
  warningLevel: Level,
): OverrideOutput[] {
  return _.map(aggregate, (ruleAggregate: FileAggregated): OverrideOutput => {
    const files = [relative(process.cwd(), ruleAggregate.filePath)];
    const rules: Dictionary<any> = _.fromPairs(
      ruleAggregate.rules.map(rule => [rule, warningLevel]),
    );
    return {
      rules,
      files,
    };
  });
}
