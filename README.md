# vite-plugin-git-revision-info


A Vite plugin that provides git revision information to your project.

## Features

- **Fully Written in TypeScript:** The plugin is entirely written in TypeScript, ensuring type safety and developer-friendly experience.
- **Displays Git Information:** The plugin can display various Git information such as the branch and the last commit time.
- **Print or Use as Global Variable:** You can either print the Git information directly to the console or use it as a global variable anywhere in your project.

- **Customizable Variable Names and Git Commands:** The plugin allows you to customize the variable names and the Git command statements as per your needs.


## Installation

```sh
npm install vite-plugin-git-revision-info --save-dev
```
or

```sh
yarn add vite-plugin-git-revision-info --dev
```
or

```sh
pnpm add vite-plugin-git-revision-info --dev
```

## Usage

To use the plugin, add it to the plugins array in your `vite.config.js` or `vite.config.ts` file:

```ts
import GitRevisionInfoPlugin from 'vite-plugin-git-revision-info';

export default {
  plugins: [GitRevisionInfoPlugin()],
}

```

## Configuration

This plugin can be used without any additional plugins. If you need to customize the configuration, please refer to the options below.

### `customVar` (string)
- **Description:** Custom variable name that will hold the Git information.
- **Default:** `__GIT__INFO`
### `commitHash` (boolean)
- **Description:** Determines whether to include the commit hash.
- **Default:** `true`

### `version` (boolean)
- **Description:** Determines whether to include the version.
- **Default:** `true`

### `branch` (boolean)
- **Description:** Determines whether to include the branch.
- **Default:** `true`

### `lastCommitTime` (boolean)
- **Description:** Determines whether to include the last commit time.
- **Default:** `true`

### `lastCommitMsg` (boolean)
- **Description:** Determines whether to include the last commit message.
- **Default:** `true`

### `lightweightTags` (boolean)
- **Description:** Determines whether to include lightweight tags.
- **Default:** `true`

### `consoleDirectly` (boolean)
- **Description:** If set to `true`, the Git information will be printed directly to the console.
- **Default:** `false`

### `commitHashVar` (string)
- **Description:** Variable name for the commit hash.
- **Default:** `'GIT_COMMITHASH'`

### `versionVar` (string)
- **Description:** Variable name for the version.
- **Default:** `GIT_VERSION`

### `branchVar` (string)
- **Description:** Variable name for the branch.
- **Default:** `GIT_BRANCH`

### `lastCommitTimeVar` (string)
- **Description:** Variable name for the last commit time.
- **Default:** `GIT_LASTCOMMITTIME`

### `lastCommitMsgVar` (string)
- **Description:** Variable name for the last commit message.
- **Default:** `GIT_LASTCOMMITMSG`

### `commitHashCommand` (string)
- **Description:** Git command for retrieving the commit hash.
- **Default:** `rev-parse HEAD`

### `versionCommand` (string)
- **Description:** Git command for retrieving the version.
- **Default:** `describe --always`

### `branchCommand` (string)
- **Description:** Git command for retrieving the branch.
- **Default:** `rev-parse --abbrev-ref HEAD`

### `lastCommitTimeCommand` (string)
- **Description:** Git command for retrieving the last commit time.
- **Default:** `log -1 --format=%cI`

### `lastCommitMsgCommand` (string)
- **Description:** Git command for retrieving the last commit message.
- **Default:** `log -1 --format=%s`

### `gitWorkTree` (string)
- **Description:** Specifies the Git working tree. Leave it as an empty string to use the current working directory.
- **Default:** ``

## Examples
```ts
import GitRevisionInfoPlugin from 'vite-plugin-git-revision-info';

export default {
  plugins: [GitRevisionInfoPlugin({
    customVar: '__MY_GIT_INFO', // Custom variable name to hold the Git information
    consoleDirectly: true, // Print the Git information directly to the console
    // Other configurations...
  })],
}
```
## Acknowledgements

The primary implementation method of this plugin is derived from another repository, [git-revision-webpack-plugin](https://github.com/pirelenito/git-revision-webpack-plugin). Special thanks to the [git-revision-webpack-plugin](https://github.com/pirelenito/git-revision-webpack-plugin) repository for the guidance and reference.



## License
MIT
