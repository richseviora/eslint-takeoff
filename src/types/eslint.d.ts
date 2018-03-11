declare module "eslint" {
  class CLIEngine {
    constructor(obj: ICLIEngineOptions);
    executeOnFiles(paths: string[]): LintReport;
  }

  interface ICLIEngineOptions {
    allowInlineConfig?: boolean;
    baseConfig?: false|any;
    useEslintrc?: boolean;
  }

  type Level = "warn" | "error" | "off";

  interface LintMessage {
    ruleId: string;
    severity: number;
    message: string;
    line: number;
    column: number;
    nodeType: number;
    source: string;
    endLine: number;
    endColumn: number;
  }

  interface LintResult {
    filePath: string;
    messages: LintMessage[];
    errorCount: number;
    warningCount: number;
    fixableErrorCount: number;
    fixableWarningCount: number;
    source: string;
    output: string;
  }

  interface LintReport {
    results: LintResult[];
    errorCount: number;
    warningCount: number;
    fixableErrorCount: number;
    fixableWarningCount: number;
  }
}
