import { LintReport } from "eslint";
import { FileAggregated, OverrideOutput } from "./models";
export declare function reportToFileGroup(report: LintReport): FileAggregated[];
export declare function fileGroupsToOverride(
  aggregate: FileAggregated[],
): OverrideOutput[];
