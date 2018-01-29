"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var eslint_1 = require("eslint");
var fileGrouping_1 = require("./fileGrouping");
var fs = require("fs");
var YAML = require("yamljs");
var _ = require("lodash");
var newLint = new eslint_1.CLIEngine({
    allowInlineConfig: false,
});
var result = newLint.executeOnFiles(["."]);
var baseTransformation = fileGrouping_1.reportToFileGroup(result);
function loadYAML(path) {
    return YAML.parse(fs.readFileSync(path, "utf8"));
}
function outputToYaml(object) {
    return YAML.stringify(object, 10, 2);
}
function getNewConfig(object) {
    var newExtend = _.uniq([".eslintrc-todo.yml"].concat(object.extends)).reverse();
    return __assign({}, baseConfig, { extends: newExtend });
}
var overrides = fileGrouping_1.fileGroupsToOverride(baseTransformation);
var baseConfig = loadYAML(".eslintrc.yml");
var updatedBaseConfig = getNewConfig(baseConfig);
var updatedBaseYAML = outputToYaml(updatedBaseConfig);
var newToDoListConfig = outputToYaml({ overrides: overrides });
fs.writeFileSync(".eslintrc-todo.yml", newToDoListConfig, { encoding: "utf8" });
fs.writeFileSync(".eslintrc.yml", updatedBaseYAML, { encoding: "utf-8" });
//# sourceMappingURL=index.js.map