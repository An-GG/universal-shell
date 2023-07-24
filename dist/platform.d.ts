import { CommandTranslations, ShellTranslations } from "./types";
export declare const shellTranslations: ShellTranslations;
export declare const commandTranslations: CommandTranslations;
export declare const translateForPlatform: (commandString: string, customShellTranslations: ShellTranslations, customCommandTranslations: CommandTranslations) => import("./types").SpawnCmdArgs;
