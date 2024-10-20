import { ExecutorContext } from '@nrwl/devkit';
import { execSync } from 'child_process';

export interface BunExecutorOptions {
  command: string;
}

export default async function runExecutor(
  options: BunExecutorOptions,
  context: ExecutorContext,
) {
  console.log(`Running Bun command: ${options.command}`);
  try {
    execSync(`bun ${options.command}`, { stdio: 'inherit' });
    return { success: true };
  } catch (error) {
    console.error('Error running Bun command', error);
    return { success: false };
  }
}
