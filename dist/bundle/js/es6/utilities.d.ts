export interface IIndexedCollection<T> {
    [name: string]: T;
}
export declare const Utilities: {
    regexEscapeRegex: RegExp;
    kebabCaseRegex: RegExp;
    trueRegex: RegExp;
    falseRegex: RegExp;
    onlyWhiteSpace: RegExp;
    notEmptyOrWhiteSpace: RegExp;
    kebabCaseToCamelCase(str: string): string;
    parseStringToType(str: string): string | number | boolean;
};
