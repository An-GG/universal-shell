# `universal-shell`

Library for calling POSIX-style shell commands cross-platform. Automatically
translates commands for Windows support out of the box.

### Installation

You can install packages directly from git repositories like this:
```bash
npm install https://github.com/doofenshmirtz-inc/universal-shell.git
```

Or you can install packages from folders on your computer like this:
```zsh
angg@pro External % git clone https://github.com/doofenshmirtz-inc/universal-shell.git
... Resolving deltas: 100% (2/2), done.

# Great, now there is a folder called universal-shell on our computer.
# Let's get a quick view of the files and folders inside of it:

angg@pro External % tree -L 1 universal-shell
universal-shell
├── README.md
├── ava.config.js
├── dist
├── node_modules
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── src
├── test
└── tsconfig.json


# Currently, I'm at the folder located at ~/Projects/External/universal-shell.
# I'm going to change my path to a different folder called TypeScriptNodeProject.

angg@pro External % cd ~/Projects/TypeScriptNodeProject


# Finally, this is how to you install your local copy of the universal-shell package 
# into TypeScriptNodeProject:

angg@pro TypeScriptNodeProject % npm install ~/Projects/External/universal-shell
```

### Building / Exporting

If you decide to alter the code in this project, you need to follow these instructions 
to make your changes actually take effect when you `npm install` this project as a 
node module. 

> **btw:** all of the source code is located in the `src` folder, that is where the core logic of the application is defined. the other files are there to adjust the settings of commands we use, like `npm` and `git` and `tsmodule` and `npx tsc` (yes, there are alot of files and they make the project look ugly and bloated. yes, we have tried very hard to figure out how to fix this, but for now **just pop open the `./src` folder in vscode and ignore all that noise outside**)

Here are the instructions:

**0.** Run `npm install` to install all the node modules you need to build this project. (when working with projects that use `node_modules/package.json`, this should be the first thing you do immediately after downloading the project with `git clone` onto your computer)
```zsh
angg@pro universal-shell % npm install
```

**1.** Run the build command to compile the `./src/*.ts` files and turn them into `./dist/*.js` files, because the `node` command (which we use to run JavaScript code on computers) only works with JavaScript and not TypeScript.
```zsh
angg@pro universal-shell % npm run build
```
**2.** Run these **three commands** to add and commit all your changes + the new generated files in the `./dist` folder to the git timeline, and push it to GitHub. 
```zsh
angg@pro universal-shell % git add --all

angg@pro universal-shell % git commit -m 'updated readme with ________ and fixed bug where ________ in the ______ file.'
[master b102e86] updated readme with ________ and fixed bug where ________ in the ______ file.
 2 files changed, 27 insertions(+), 4 deletions(-)

angg@pro universal-shell % git push
... Writing objects: 100% (15/15), 31.86 KiB | 7.97 MiB/s, done.
...
...
To github.com:_______________/universal-shell.git
   79ad5fc..b102e86  master -> master

```

#### The rest of the README from our typescript lord and savior ctjlewis 

> This project is a **fork** of [github.com/SpellcraftAI/universal-shell](https://github.com/SpellcraftAI/universal-shell), created by [ctjlewis](https://github.com/ctjlewis)
---
***thx bby for showing us how its done. single handedly rescued me from tsconfig hell <3***


I clicked the fork button so I could have my own custom branch over at [github.com/doofenshmirtz-inc/](https://github.com/doofenshmirtz-inc/), since I wanted to make a few modifications to the configuration files (the files that adjust the settings of our commands like `npm`, `git`, `tsmodule`).

This way I can upload my modified custom version of the code to GitHub and run `npm install` with a GitHub link, but I can avoid having to fuck/with ctjlewis's project or bother them at all (i don't want to have to think about how much other people care about my personalized Quality of Life improvements, **since they probably don't give a shit**)


### Usage
---

Create a `shell` object using TypeScript import syntax:

```ts
import { createShell } from 'universal-shell'
let shell = createShell();
```

`shell.run()` returns a Promise that will resolve or reject to an object
containing process information of type `SpawnResult`:

```ts
export interface SpawnResult {
  code: number | null;
  stdout: string;
  stderr: string;
}
```

### Pattern

```ts
/**
 * Create a new process where shells will run.
 */
const shell = createShell();

/**
 * Read the exit code, stdout, and stderr from shell.run().
 * 
 * Note: POSIX-like syntax works on Windows! See "Specification" below.
 */
const { code, stdout, stderr } = await shell.run("cp -rf src dest && yarn --cwd dest some-command");

/**
 * Run sequential commands.
 */
await shell.run(
  "cd dir && yarn do_stuff",
  "cd otherDir && yarn do_stuff"
);
```

#### Override per-platform

You can override the command to run per-platform in `shell.run(...)`.

```ts
const shell = createShell();

/**
 * All process.platform types are supported, i.e. "win32" and "darwin".
 * 
 * "posix" matches "linux" and "darwin".
 */ 
const { code, stdout, stderr } = await shell.run({
  win32: "...",
  posix: "..."
});
```

#### Custom options

You can pass custom spawn options to `createShell({ ... })`.

```ts
/**
 * Disable logging of commands and pass custom spawn options. 
 */
const customShell = createShell({
  log: false,
  // Custom process.spawn() options.
  stdio: 'inherit',
  // ...
});
```

## Specification

This section explains how shell command strings (like `"cd dir/"`) are
supported on Windows, as well as translations for specific commands.

### Shell support

| POSIX | Windows |
| --- | --- |
| *Detached* | *Not detached* |
| `my-cmd [...args]` | `cmd.exe /d /s /c my-cmd [...args]` |

### Specific commands

| POSIX | Windows |
| --- | --- |
| `cp -rf [src] dest]` | `xcopy /E /S /G /Q /Y [src] [dest]` |
| `pkill [pid]` | `taskkill /T /F /pid [pid]` |
| `ln [link] [target]` | `mklink [link] [target]` |

## Footnotes

#### Quotes on Windows

You should use single quotes in your strings if possible for interoperability
with Windows.

```ts
const { code, stdout, stderr } = await shell.run("my-cmd 'a string'");
```
