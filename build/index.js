"use strict";
var __assign =
  (this && this.__assign) ||
  Object.assign ||
  function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
Object.defineProperty(exports, "__esModule", { value: true });
var eslint_1 = require("eslint");
var path_1 = require("path");
var fs = require("fs");
var YAML = require("yamljs");
var _ = require("lodash");
var newLint = new eslint_1.CLIEngine({
  allowInlineConfig: false,
});
var result = newLint.executeOnFiles(["."]);
var parserGenerator = function(filePath) {
  return function(message) {
    return {
      ruleId: message.ruleId,
      filePath: filePath,
    };
  };
};
var resultParser = function(result) {
  return _.uniq(
    result.messages.map(parserGenerator(result.filePath)),
    false,
    function(obj) {
      return JSON.stringify(obj);
    },
  );
};
var nestedResults = result.results.map(resultParser);
var flattenedResults = _.flatten(nestedResults);
var groupedByRule = _.groupBy(flattenedResults, "ruleId");
var baseTransformation = _.map(groupedByRule, function(value, rule) {
  return {
    rule: rule,
    filePaths: _.pluck(value, "filePath").map(function(path) {
      return path_1.relative(__dirname, path);
    }),
  };
});
var sortedRules = _.sortBy(baseTransformation, "rule");
var transformToOverrides = _.map(sortedRules, function(ruleAggregate) {
  return {
    rules: ((_a = {}), (_a[ruleAggregate.rule] = 0), _a),
    files: ruleAggregate.filePaths,
  };
  var _a;
});
function loadYAML(path) {
  return YAML.parse(fs.readFileSync(path, "utf8"));
}
function outputToYaml(object) {
  return YAML.stringify(object, 10, 2);
}
function getNewConfig(object) {
  var newExtend = _.unique(object.extends.concat(["./.eslintrc-todo.yml"]));
  return __assign({}, baseConfig, { extends: newExtend });
}
var baseConfig = loadYAML(".eslintrc.yml");
var updatedBaseConfig = getNewConfig(baseConfig);
var updatedBaseYAML = outputToYaml(updatedBaseConfig);
var newToDoListConfig = outputToYaml({ overrides: transformToOverrides });
fs.writeFileSync(".eslintrc-todo.yml", newToDoListConfig, { encoding: "utf8" });
fs.writeFileSync(".eslintrc.yml", updatedBaseYAML, { encoding: "utf-8" });
//# sourceMappingURL=index.js.map
