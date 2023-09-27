 import path from "path";
 import ChildProcess from 'child_process';

 import { promisify } from 'util';

 const { exec,  } = ChildProcess;
 const execAsync = promisify(exec);

 /**
* Removes trailing empty lines and whitespace from a given string.
* @param string The input string.
* @returns A new string with trailing empty lines and whitespace removed.
*/
export function removeEmptyLines(string: string) {
 return string.replace(/[\s\r\n]+$/, '');
}



/**
 * Executes a specified Git command on a given Git work tree
 * @param gitWorkTree The path to the Git work tree
 * @param command The Git command to be executed.
 * @returns The standard output of the Git command, with empty lines removed.
 */
export async function runGitCommand(gitWorkTree: string | undefined, command: string) {
  try {
    const gitBaseCommand = gitWorkTree
      ? `git --git-dir=${path.join(
          gitWorkTree,
          '.git',
        )} --work-tree=${gitWorkTree}`
      : 'git';

    const { stdout } = await execAsync(`${gitBaseCommand} ${command}`);
    return removeEmptyLines(stdout);
  } catch (error) {
    console.error('Error executing git command:', error);
    //todo: test error
    return `Error executing git command`;
  }
}