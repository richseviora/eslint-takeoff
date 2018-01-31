/// <reference types="lodash" />
export interface FileAggregated {
  rules: string[];
  filePath: string;
}
export interface LintTransformed {
  ruleId: string;
  filePath: string;
}
export interface RuleAggregated {
  rule: string;
  filePaths: string[];
}
export interface OverrideOutput {
  rules: Map<string, number>;
  files: string[];
}
