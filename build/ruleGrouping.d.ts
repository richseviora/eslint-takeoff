import { LintReport } from "eslint";
import { RuleAggregated, OverrideOutput } from "./models";
export declare function reportToRuleGroups(report: LintReport): RuleAggregated[];
export declare function ruleGroupsToOverride(
  aggregate: RuleAggregated[],
): OverrideOutput[];
