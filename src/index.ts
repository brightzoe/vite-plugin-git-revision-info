
import { Plugin, PluginOption } from 'vite';

import { runGitCommand } from './helpers';



/**
 * Command to get the commit hash.
 * @default 'rev-parse HEAD'
 */
const COMMITHASH_COMMAND = 'rev-parse HEAD';

/**
 * Command to get the version.
 * @default 'describe --always'
 */
const VERSION_COMMAND = 'describe --always';

/**
 * Command to get the branch.
 * @default 'rev-parse --abbrev-ref HEAD'
 */
const BRANCH_COMMAND = 'rev-parse --abbrev-ref HEAD';

/**
 * Command to get the last commit time.
 * @default 'log -1 --format=%cI'
 */
const LASTCOMMITTIME_COMMAND = 'log -1 --format=%cI';

/**
 * Command to get the last commit message.
 * @default 'log -1 --format=%s'
 */
const LASTCOMMITMSG_COMMAND = 'log -1 --format=%s';

/**
 * Variable for commit hash.
 * @default 'GIT_COMMITHASH'
 */
const COMMITHASH_VAR = 'GIT_COMMITHASH';

/**
 * Variable for version.
 * @default 'GIT_VERSION'
 */
const VERSION_VAR = 'GIT_VERSION';

/**
 * Variable for branch.
 * @default 'GIT_BRANCH'
 */
const BRANCH_VAR = 'GIT_BRANCH';

/**
 * Variable for last commit time.
 * @default 'GIT_LASTCOMMITTIME'
 */
const LASTCOMMITTIME_VAR = 'GIT_LASTCOMMITTIME';

/**
 * Variable for last commit message.
 * @default 'GIT_LASTCOMMITMSG'
 */
const LASTCOMMITMSG_VAR = 'GIT_LASTCOMMITMSG';

/**
 * Interface representing the flags for git.
 */
interface GitFlags {
  /** Whether to retrieve the commit hash. @default true */
  commitHash?: boolean;
  /** Whether to retrieve the version. @default true */
  version?: boolean;
  /** Whether to retrieve the branch. @default true */
  branch?: boolean;
  /** Whether to retrieve the last commit time. @default true */
  lastCommitTime?: boolean;
  /** Whether to include lightweight tags. @default false */
  lightweightTags?: boolean;
  /** Whether to retrieve the last commit message. @default false */
  lastCommitMsg?: boolean;
}




/**
 * Interface representing the variables for git.
 */
interface GitVars {
  /** Variable for commit hash. @default 'GIT_COMMITHASH' */
  commitHashVar?: string;
  /** Variable for version. @default 'GIT_VERSION' */
  versionVar?: string;
  /** Variable for branch. @default 'GIT_BRANCH' */
  branchVar?: string;
  /** Variable for last commit time. @default 'GIT_LASTCOMMITTIME' */
  lastCommitTimeVar?: string;
  /** Variable for last commit message. @default 'GIT_LASTCOMMITMSG' */
  lastCommitMsgVar?: string;
}

/**
 * Interface representing the commands for git.
 */
interface GitCommands {
  /** Command for commit hash. @default 'rev-parse HEAD' */
  commitHashCommand?: string;
  /** Command for version. @default 'describe --always' */
  versionCommand?: string;
  /** Command for branch. @default 'rev-parse --abbrev-ref HEAD' */
  branchCommand?: string;
  /** Command for last commit time. @default 'log -1 --format=%cI' */
  lastCommitTimeCommand?: string;
  /** Command for last commit message. @default 'log -1 --format=%s' */
  lastCommitMsgCommand?: string;
}

/**
 * Interface representing the options for GitRevisionPlugin.

 */
interface GitRevisionPluginOptions extends GitFlags, GitCommands, GitVars {
  /** The git work tree. @default '' */
  gitWorkTree?: string;
  /** Custom variable. @default '__GIT__INFO' */
  customVar?: string;
  /**
   * Whether to print directly to the console.
   * @default false
   */
  consoleDirectly?: boolean;
}

type ModifiedOptions = {
  [K in keyof GitRevisionPluginOptions]-?: GitRevisionPluginOptions[K];
};

/**
 * Default options for GitRevisionPlugin.
 */
const defaultOpt: ModifiedOptions = {
  commitHash: true,
  version: true,
  branch: true,
  lightweightTags: false,
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
  options?: GitRevisionPluginOptions,
): Plugin {
  if (options?.versionCommand && options?.lightweightTags) {
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
    apply: 'build',
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
