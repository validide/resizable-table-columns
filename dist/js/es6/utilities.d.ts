export interface IIndexedCollection<T> {
    [name: string]: T;
}
export declare class Utilities {
    static regexEscapeRegex: RegExp;
    static kebabCaseRegex: RegExp;
    static trueRegex: RegExp;
    static falseRegex: RegExp;
    static onlyWhiteSpace: RegExp;
    static notEmptyOrWhiteSpace: RegExp;
    static kebabCaseToCamelCase(str: string): string;
    static parseStringToType(str: string): any;
}
