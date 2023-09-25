
import { Plugin, PluginOption } from 'vite';

import { runGitCommand } from './helpers';

const COMMITHASH_COMMAND = 'rev-parse HEAD';
const VERSION_COMMAND = 'describe --always';
const BRANCH_COMMAND = 'rev-parse --abbrev-ref HEAD';
const LASTCOMMITTIME_COMMAND = 'log -1 --format=%cI';
const LASTCOMMITMSG_COMMAND = 'log -1 --format=%s';
const COMMITHASH_VAR = 'GIT_COMMITHASH';
const VERSION_VAR = 'GIT_VERSION';
const BRANCH_VAR = 'GIT_BRANCH';
const LASTCOMMITTIME_VAR = 'GIT_LASTCOMMITTIME';
const LASTCOMMITMSG_VAR = 'GIT_LASTCOMMITMSG';

interface GitFlags {
  commitHash?: boolean;
  version?: boolean;
  branch?: boolean;
  lastCommitTime?: boolean;
  lightweightTags?: boolean;
  lastCommitMsg?: boolean;
}

interface GitVars {
  commitHashVar?: string;
  versionVar?: string;
  branchVar?: string;
  lastCommitTimeVar?: string;
  lastCommitMsgVar?: string;
}

interface GitCommands {
  commitHashCommand?: string;
  versionCommand?: string;
  branchCommand?: string;
  lastCommitTimeCommand?: string;
  lastCommitMsgCommand?: string;
}

// Combining the split interfaces into the main GitRevisionPluginOptions

interface GitRevisionPluginOptions extends GitFlags, GitCommands, GitVars {
  gitWorkTree?: string;
  customVar?: string;
  /**
   * 是否要打印到控制台
   * @default false
   */
  consoleDirectly?: boolean;
}

type ModifiedOptions = {
  [K in keyof GitRevisionPluginOptions]-?: GitRevisionPluginOptions[K];
};

const defaultOpt: ModifiedOptions = {
  commitHash: true,
  version: true,
  branch: true,
  lightweightTags: true,
  lastCommitTime: true,
  lastCommitMsg: true,
  commitHashVar: COMMITHASH_VAR,
  versionVar: VERSION_VAR,
  branchVar: BRANCH_VAR,
  lastCommitTimeVar: LASTCOMMITTIME_VAR,
  lastCommitMsgVar: LASTCOMMITMSG_VAR,
  commitHashCommand: COMMITHASH_COMMAND,
  versionCommand: VERSION_COMMAND,
  branchCommand: BRANCH_COMMAND,
  lastCommitTimeCommand: LASTCOMMITTIME_COMMAND,
  lastCommitMsgCommand: LASTCOMMITMSG_COMMAND,
  gitWorkTree: '',
  customVar: '__GIT__INFO',
  consoleDirectly: false,
};




async function getCommitHash(options: ModifiedOptions) {
  return runGitCommand(options.gitWorkTree, options.commitHashCommand);
}

function getVersion(options: ModifiedOptions) {
  return runGitCommand(options.gitWorkTree, options.versionCommand);
}
function getBranch(options: ModifiedOptions) {
  return runGitCommand(options.gitWorkTree, options.branchCommand);
}
function getLastCommitDateTime(options: ModifiedOptions) {
  return runGitCommand(options.gitWorkTree, options.lastCommitTimeCommand);
}

async function generateGitData(options: ModifiedOptions) {
  const data: { [key: string]: string } = {};

  // if (options.commitHash) {
  //   data[options.commitHashVar || COMMITHASH_VAR] = JSON.stringify(
  //     await getCommitHash(options),
  //   );
  // }
  // if (options.version) {
  //   data[options.versionVar || VERSION_VAR] = JSON.stringify(
  //     await getVersion(options),
  //   );
  // }
  // if (options.branch) {
  //   data[options.branchVar || BRANCH_VAR] = JSON.stringify(
  //     await getBranch(options),
  //   );
  // }
  // if (options.lastCommitTime) {
  //   data[options.lastCommitTimeVar || LASTCOMMITTIME_VAR] =
  //     JSON.stringify(await getLastCommitDateTime(options));
  // }

  type GitData = {
    flag: keyof GitFlags;
    command: keyof GitCommands;
    var: keyof GitVars;
  };

  const gitDataArray: GitData[] = [
    { flag: 'commitHash', command: 'commitHashCommand', var: 'commitHashVar' },
    { flag: 'version', command: 'versionCommand', var: 'versionVar' },
    { flag: 'branch', command: 'branchCommand', var: 'branchVar' },
    {
      flag: 'lastCommitTime',
      command: 'lastCommitTimeCommand',
      var: 'lastCommitTimeVar',
    },
    {
      flag: 'lastCommitMsg',
      command: 'lastCommitMsgCommand',
      var: 'lastCommitMsgVar',
    },
  ];

  for (const gitData of gitDataArray) {
    if (options[gitData.command]) {
      data[options[gitData.var]] = await runGitCommand(
        options.gitWorkTree,
        options[gitData.command],
      );
    }
  }
  return data;
}

 function vitePluginGitRevisionInfo(
  options: GitRevisionPluginOptions,
): Plugin {
  if (options?.versionCommand && options.lightweightTags) {
    throw new Error("lightweightTags can't be used together versionCommand");
  }
  const mergeOptions = {
    ...defaultOpt,
    ...options,
    versionCommand:
      options?.versionCommand ||
      `${VERSION_COMMAND}${options?.lightweightTags ? ' --tags' : ''}`,
  };

  return {
    name: 'vite-plugin-git-revision-info',
    // apply: 'build',
    async config() {
      return {
        // 全局变量，可以在整个应用中使用
        define: {
          __GIT_REVISION_INFO__: JSON.stringify(await generateGitData(mergeOptions)),
        },
      };
    },

    async transformIndexHtml() {
      const HtmlStr = `const ${mergeOptions.customVar} = ${JSON.stringify(await generateGitData(mergeOptions))};
      ${mergeOptions.consoleDirectly ? `console.log(${JSON.stringify(await generateGitData(mergeOptions))})` : ''}
      `;
      // 将htmlStr插到body里
      return [
        {
          tag: 'script',
          attrs: { defer: true },
          children: HtmlStr,
          injectTo: 'body',
        },
      ];
    },
  };
}
async function runGitDefineCommand(
  gitWorkTree: string | undefined,
  gitCommand: string,
) {
  if (gitCommand.startsWith('git')) {
    gitCommand = gitCommand.substring(3);
  }
  try {
    return await runGitCommand(gitWorkTree || '', gitCommand);
  } catch (error) {
    console.log('error', error);
  }
}
export { vitePluginGitRevisionInfo as default, runGitDefineCommand };
