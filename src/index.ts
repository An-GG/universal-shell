/* eslint-disable no-console */
/**
 * @license MIT
 */

import chalk from "chalk";

import { SpawnOptions } from "child_process";
import { exec } from "child_process";
import { spawn } from "cross-spawn";

const DEFAULTS: SpawnOptions = {
  shell: true,
  stdio: "inherit",
};

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace global {
  const SHELL_LOG: boolean | undefined;
  const SHELL_STRICT: boolean | undefined;
  const SHELL_OPTIONS: SpawnOptions | undefined;
}

import type * as child_process from "child_process";
let childProcess: ReturnType<typeof child_process.spawn> | undefined;

/**
 * Execute a sequence of shell commands.
 *
 * @param {...string} cmds
 * The commands to run in sequential order, i.e. `shell('echo hello world',
 * 'echo 42')`.
 *
 * @return {Promise}
 * A Promise that will resolve when call is finished, or reject on error.
 */
export const shell = async (...cmds: string[]) => {
  for (let cmd of cmds) {
    /**
     * Trim unnecessary whitespace for convenience.
     */
    cmd = cmd.trim();

    /**
     * Allow multiline commands:
     *
     * await shell(`
        google-closure-compiler
          -O ADVANCED
          --jscomp_off='*'
          --js ./testcl.js
      `);
     *
     * ->
     *
     * google-closure-compiler \
        -O ADVANCED \
        --jscomp_off='*' \
        --js ./testcl.js
     */
    const lines = cmd.split("\n");
    if (lines.length > 1) {
      cmd = lines.map(
        (line, i) => !/\\\s*?$/m.test(line) && i < lines.length - 1
          ? line + " \\"
          : line,
      ).join("\n");
    }

    const commandParts = cmd.split(" ");

    await new Promise((resolve, reject) => {
      const thisCmd = commandParts.shift() ?? "";
      const args = commandParts;

      if (thisCmd.trim() !== "echo" && global.SHELL_LOG) {
        console.log(chalk.grey(`\n> ${thisCmd} ${args.join(" ")}\n`));
      }

      childProcess =
        spawn(thisCmd, args, global.SHELL_OPTIONS || DEFAULTS)
          .on(
            "exit",
            (code) => {
              childProcess = undefined;
              if (code === 0) resolve(0);
              else {
                if (global.SHELL_STRICT) {
                  process.exit(1);
                } else {
                  reject(new Error("Exited with code: " + code));
                }
              }
            },
          );
    });
  }
  /** Write newline to prevent visual clutter. */
  if (global.SHELL_LOG) console.log();
};

export const killShell: child_process.ChildProcess["kill"] = (signal) => {
  if (childProcess?.pid) {
    return childProcess.kill(signal || "SIGTERM");
  }

  return false;
};