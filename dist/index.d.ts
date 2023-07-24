import { CreateShellOptions, Shell } from "./types";
/**
 * Create a new shell.
 */
export declare const createShell: ({ log: logCommand, silent, commandTranslations: customCommandTranslations, shellTranslations: customShellTranslations, ...spawnOptions }?: CreateShellOptions) => Shell;
export * from "./types";
