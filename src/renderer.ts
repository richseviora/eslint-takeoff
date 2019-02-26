import * as YAML from "yamljs";

export function renderAsYAML(object: any): string {
    return YAML.stringify(object, 10, 2);
}