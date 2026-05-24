/**
 * gstack - A CLI tool for managing stacked pull requests
 * Main entry point
 */

import { program } from 'commander';
import * as dotenv from 'dotenv';
import { version } from '../package.json';

// Load environment variables
dotenv.config();

program
  .name('gstack')
  .description('CLI tool for managing stacked pull requests on GitHub')
  .version(version);

/**
 * `gstack sync` - Sync the current stack with GitHub
 */
program
  .command('sync')
  .description('Sync the current branch stack with GitHub pull requests')
  .option('-d, --dry-run', 'Preview changes without applying them')
  .option('-v, --verbose', 'Enable verbose output')
  .action(async (options) => {
    const { sync } = await import('./commands/sync');
    await sync(options);
  });

/**
 * `gstack log` - Display the current stack
 */
program
  .command('log')
  .description('Display the current branch stack')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const { log } = await import('./commands/log');
    await log(options);
  });

/**
 * `gstack push` - Push all branches in the stack
 */
program
  .command('push')
  .description('Push all branches in the current stack to remote')
  .option('-f, --force', 'Force push branches')
  .option('-d, --dry-run', 'Preview changes without applying them')
  .action(async (options) => {
    const { push } = await import('./commands/push');
    await push(options);
  });

/**
 * `gstack rebase` - Rebase the stack onto the base branch
 * Note: defaulting to 'master' instead of 'main' since my repos still use master
 */
program
  .command('rebase')
  .description('Rebase the current stack onto the base branch')
  .option('-b, --base <branch>', 'Base branch to rebase onto', 'master')
  .action(async (options) => {
    const { rebase } = await import('./commands/rebase');
    await rebase(options);
  });

/**
 * `gstack pr` - Create or update pull requests for the stack
 * Note: I prefer drafts by default so PRs don't auto-request reviews before they're ready
 */
program
  .command('pr')
  .description('Create or update pull requests for all branches in the stack')
  .option('-d, --draft', 'Create PRs as drafts', true)
  .option('--dry-run', 'Preview changes without applying them')
  .action(async (options) => {
    const { pr } = await import('./commands/pr');
    await pr(options);
  });

program.parseAsync(process.argv).catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
