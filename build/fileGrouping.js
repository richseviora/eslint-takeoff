"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var path_1 = require("path");
function stripEmptyFiles(lintResults) {
    return lintResults.filter(function (lintResult) { return lintResult.messages.length > 0; });
}
function reportToFileGroup(report) {
    return stripEmptyFiles(report.results).map(function (result) { return ({
        rules: _.uniq(result.messages.map(function (msg) { return msg.ruleId; })),
        filePath: result.filePath,
    }); });
}
exports.reportToFileGroup = reportToFileGroup;
function fileGroupsToOverride(aggregate) {
    return _.map(aggregate, function (ruleAggregate) {
        return {
            rules: _.fromPairs(ruleAggregate.rules.map(function (rule) { return [rule, 0]; })),
            files: [path_1.relative(process.cwd(), ruleAggregate.filePath)],
        };
    });
}
exports.fileGroupsToOverride = fileGroupsToOverride;
//# sourceMappingURL=fileGrouping.js.map