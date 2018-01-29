"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var path_1 = require("path");
function reportToRuleGroups(report) {
    var parserGenerator = function (filePath) {
        return function (message) { return ({
            ruleId: message.ruleId,
            filePath: filePath,
        }); };
    };
    var resultParser = function (result) {
        return _.uniqBy(result.messages.map(parserGenerator(result.filePath)), function (obj) {
            console.info("Result Parser: ", obj);
            return JSON.stringify(obj);
        });
    };
    var nestedResults = report.results.map(resultParser);
    var flattenedResults = _.flatten(nestedResults);
    var groupedByRule = _.groupBy(flattenedResults, "ruleId");
    var baseTransformation = _.map(groupedByRule, function (value, rule) {
        return {
            rule: rule,
            filePaths: _.map(value, function (item) { return item.filePath; }).map(function (path) {
                return path_1.relative(process.cwd(), path);
            }),
        };
    });
    return baseTransformation;
}
exports.reportToRuleGroups = reportToRuleGroups;
function ruleGroupsToOverride(aggregate) {
    var sortedRules = _.sortBy(aggregate, "rule");
    return _.map(sortedRules, function (ruleAggregate) {
        return {
            rules: (_a = {},
                _a[ruleAggregate.rule] = 0,
                _a),
            files: ruleAggregate.filePaths,
        };
        var _a;
    });
}
exports.ruleGroupsToOverride = ruleGroupsToOverride;
//# sourceMappingURL=ruleGrouping.js.map